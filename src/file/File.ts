import { writeFile } from 'fs/promises';
import Batch from '../batch/Batch.js';
import achBuilder from '../class/achParser.js';
import { highLevelFileOverrides } from '../overrides.js';
import { computeCheckDigit, generateString, getNextMultiple, getNextMultipleDiff, pad } from '../utils.js';
import validations from '../validate.js';
import { FileControls, FileHeaders, FileOptions, HighLevelFileOverrides } from './FileTypes.js';
import { fileControls } from './control.js';
import { fileHeaders } from './header.js';

export default class File extends achBuilder<'File'> {
  overrides: HighLevelFileOverrides[];
  header: FileHeaders;
  control: FileControls;
  private _batches: Array<Batch> = [];
  private _batchSequenceNumber = 0;

  /**
   * 
   * @param {FileOptions} options
   * @param {boolean} autoValidate
   * @param {boolean} debug
   */
  constructor(options: FileOptions, autoValidate: boolean = true, debug: boolean = false) {
    super({ options, name: 'File', debug });

    this.overrides = highLevelFileOverrides;

    this.header = options.header
      ? { ...options.header, ...fileHeaders }
      : { ...fileHeaders };
    this.control = options.control
      ? { ...options.control, ...fileControls }
      : { ...fileControls };

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

  async generateBatches(){
    let result = '';
    let rows = 2;

    let entryHash = 0;
    let addendaCount = 0;

    let totalDebit = 0;
    let totalCredit = 0;

    for await (const batch of this._batches) {
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
        const batchString = await batch.generateString();
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

  async generateFile(): Promise<string> {
    const { result: batchString, rows } = await this.generateBatches();
  
    // Generate the file header
    const header = await this.generateHeader();

    // Generate the file control
    const control = await this.generateControl();

    // Generate the padded rows
    const paddedRows = this.generatePaddedRows(getNextMultipleDiff(rows, 10));

    // Resolve the promise with the full file string
    return `${header}\r\n${batchString}${control}${paddedRows}`;
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
