import fs, { writeFile } from 'fs/promises';
import Batch from '../batch/Batch.js';
import { BatchControls, BatchHeaders, BatchOptions } from '../batch/batchTypes.js';
import { control as batchControls } from '../batch/control.js';
import { header as batchHeaders } from '../batch/header.js';
import achBuilder from '../class/achParser.js';
import EntryAddenda from '../entry-addenda/EntryAddenda.js';
import { fields as addendaFields } from '../entry-addenda/fields.js';
import Entry from '../entry/Entry.js';
import { EntryOptions } from '../entry/entryTypes.js';
import { fields as entryFields } from '../entry/fields.js';
import { computeCheckDigit, generateString, getNextMultiple, getNextMultipleDiff, pad } from '../utils.js';
import { FileControls, FileHeaders, FileOptions } from './FileTypes.js';
import { fileControls } from './control.js';
import { fileHeaders } from './header.js';
import validations from '../validate.js';
import nACHError from '../error.js';

export default class File extends achBuilder<'File'> {
  header!: FileHeaders;
  control!: FileControls;
  private _batches: Array<Batch> = [];
  private _batchSequenceNumber = 0;

  constructor(options: FileOptions, autoValidate = true, debug = false) {
    super({ options, name: 'File', debug });

    if (('header' in this && 'control' in this)
        && this.typeGuards.isFileOverrides(this.overrides)
        && this.typeGuards.isFileOptions(this.options)
      ){
        this.overrides.forEach((field) => {
          if (field in this.options && this.options[field] !== undefined){
            const value = this.options[field];
            if (value !== undefined) this.set(field, value);
          }
        });
      }

    // This is done to make sure we have a 9-digit routing number
    if (options.immediateDestination) {
      this.header.immediateDestination.value = computeCheckDigit(options.immediateDestination);
    }

    this._batchSequenceNumber = Number(options.batchSequenceNumber) || 0

    if (autoValidate) this.validate();
  }

  private validate(){
    const { validateDataTypes, validateLengths } = validations(this);

    // Validate header field lengths
    validateLengths(this.header);

    // Validate header data types
    validateDataTypes(this.header);

    // Validate control field lengths
    validateLengths(this.control);

    // Validate header data types
    validateDataTypes(this.control);
  }

  addBatch(batch: Batch) {
    // Set the batch number on the header and control records
    batch.header.batchNumber.value = this._batchSequenceNumber
    batch.control.batchNumber.value = this._batchSequenceNumber

    // Increment the batchSequenceNumber
    this._batchSequenceNumber++

    // Add the batch to the file
    this._batches.push(batch)
  }

  getBatches() { return this._batches; }

  generatePaddedRows(rows: number): string {
    let paddedRows = '';
  
    for (let i = 0; i < rows; i++) {
      paddedRows += '\r\n' + pad('', 94, false, '9');
    }
  
    return paddedRows;
  }

  generateHeader() { return generateString(this.header); }
  generateControl() { return generateString(this.control); }

  generateBatches(){
    let result = '';
    let rows = 2;

    let entryHash = 0;
    let addendaCount = 0;

    let totalDebit = 0;
    let totalCredit = 0;

    for (const batch of this._batches) {
      totalDebit += batch.control.totalDebit.value;
      totalCredit += batch.control.totalCredit.value;
  
      for (const entry of batch._entries) {
        entry.fields.traceNumber.value = entry.fields.traceNumber.value
          ?? (this.header.immediateOrigin.value.slice(0, 8) + pad(addendaCount, 7, false, '0'));

        entryHash += Number(entry.fields.receivingDFI.value);
  
        // Increment the addenda and block count
        addendaCount++;
        rows++;
      }
  
      // Only iterate and generate the batch if there is at least one entry in the batch
      if (batch._entries.length > 0) {
        // Increment the addendaCount of the batch
        this.control.batchCount.value++;
  
        // Bump the number of rows only for batches with at least one entry
        rows = rows + 2;
  
        // Generate the batch after we've added the trace numbers
        const batchString = batch.generateString();
        result += batchString + '\r\n';
      }
    }
  
    this.control.totalDebit.value = totalDebit;
    this.control.totalCredit.value = totalCredit;
  
    this.control.addendaCount.value = addendaCount;
    this.control.blockCount.value = getNextMultiple(rows, 10) / 10;
  
    // Slice the 10 rightmost digits.
    this.control.entryHash.value = Number(entryHash.toString().slice(-10));
  
    return { result, rows };
  }

  generateFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        // Generate the batches
        const { result: batchString, rows } = this.generateBatches();
  
        // Generate the file header
        const header = this.generateHeader();
  
        // Generate the file control
        const control = this.generateControl();
  
        // Generate the padded rows
        const paddedRows = this.generatePaddedRows(getNextMultipleDiff(rows, 10));
  
        // Resolve the promise with the full file string
        resolve(header + '\r\n' + batchString + control + paddedRows);
      } catch (e) {
        reject(e);
      }
    })
  }

  async writeFile(path: string){
    try {
      const fileString = await this.generateFile();
      return await writeFile(path, fileString)
    } catch (error) {
      console.error('[node-natcha::File:writeFile] - Error', error);
      throw error;
    }
  }

  static async parseFile(filePath: string, debug = false) {
    try {
      const data = await fs.readFile(filePath, { encoding: 'utf-8' });
      const file = await this.parse(data, debug);
      return file;
    } catch (err) {
      console.error('[node-natcha::File:parseFile] - Error', err);
      throw new nACHError({
        name: 'File Parse Error',
        message: err.message,
      });
    }
  }

  static parse(str: string, debug: boolean): Promise<File> {
    const parseLine = (str: string, object: Record<string, Record<string, unknown> & { width: number }>): Record<string, string> => {
      let pos = 0;
    
      return Object.keys(object).reduce((result: Record<string, string>, key: string) => {
        const field = object[key];
        result[key] = str.substring(pos, pos + field.width).trim();
        pos += field.width;
        return result;
      }, {});
    }

    return new Promise((resolve, reject) => {
      if (!str || !str.length) { reject('Input string is empty'); return; }

      const lines = (str.length <= 1)
        ? Array.from({ length: Math.ceil(str.length / 94) }, (_, i) => str.substr(i * 94, 94))
        : str.split('\n');

      const file: Partial<FileOptions> = {};
      const batches: Array<Partial<BatchOptions> & { entry: Array<Entry> }> = [];
      let batchIndex = 0;
      let hasAddenda = false;

      lines.forEach((line) => {
        try {
          if (!line || !line.length) return;
          const lineType = parseInt(line[0]);

          if (lineType === 1) file.header = parseLine(line, fileHeaders) as unknown as FileHeaders;
          if (lineType === 9) file.control = parseLine(line, fileControls) as unknown as FileControls;
          if (lineType === 5){
            batches.push({
              header: parseLine(line, batchHeaders) as unknown as BatchHeaders,
              entry: [],
            });
          }
          if (lineType === 8) {
            batches[batchIndex].control = parseLine(line, batchControls) as unknown as BatchControls;
            batchIndex++;
          }
          if (lineType === 6){
            batches[batchIndex].entry.push(
              new Entry(parseLine(line, entryFields) as unknown as EntryOptions, undefined, debug)
            );
          }
          if (lineType === 7) {
            batches[batchIndex]
              .entry[batches[batchIndex].entry.length - 1]
              .addAddenda(
                new EntryAddenda(parseLine(line, addendaFields), undefined, debug)
              );
            hasAddenda = true;
          }
        } catch (error) {
          console.log('[node-natcha::File:parse] - Error', error)
          reject(error);
        }
        
      });

      if (!file.header) { reject('File header missing or not parsable error'); return; } 
      if (!file.control){ reject('File control missing or not parsable error'); return; }
      if (!batches.length) { reject('No batches found'); return; }

      try {
        const nachFile = new File(file.header as unknown as FileOptions, !hasAddenda, debug);

        batches.forEach((batchOb) => {
          const batch = new Batch(batchOb.header as unknown as BatchOptions, undefined, debug);
          batchOb.entry.forEach((entry) => {
            batch.addEntry(entry);
          });
          nachFile.addBatch(batch);
        });

        resolve(nachFile);
      } catch (e) {
        reject(e);
      }
    });
  }

  isAHeaderField(field: keyof FileHeaders|keyof FileControls): field is keyof FileHeaders {
    return Object.keys(this.header).includes(field)
  }

 isAControlField(field: keyof FileHeaders|keyof FileControls): field is keyof FileControls {
    return Object.keys(this.control).includes(field)
  }

  get<Field extends keyof FileHeaders|keyof FileControls = keyof FileHeaders>(field: Field) {
    // If the header has the field, return the value
    if (field in this.header && this.isAHeaderField(field)){
      return this.header[field]['value'] as Field extends keyof FileHeaders ? typeof this.header[Field]['value'] : never;
    }

    // If the control has the field, return the value
    if (field in this.control && this.isAControlField(field)) return this.control[field]['value'] as Field extends keyof FileControls ? typeof this.control[Field]['value'] : never;

    throw new Error(`Field ${field} not found in Batch header or control.`);
  }

  set<Key extends keyof FileHeaders|keyof FileControls = keyof FileHeaders>(
    field: Key,
    value: string|number
  ) {
    // If the header has the field, set the value
    if (field in this.header && this.isAHeaderField(field)) {
      return this.header[field satisfies keyof FileHeaders].value = value as string;
    }

    // If the control has the field, set the value
    if (field in this.control && this.isAControlField(field)) {
      return this.control[field satisfies keyof FileControls]['value'] = value;
    }
  }
}
module.exports = File;
