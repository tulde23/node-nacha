import { readFile } from 'fs/promises';
import Batch from '../batch/Batch.js';
import { BatchControls, BatchHeaders, BatchOptions } from '../batch/batchTypes.js';
import { control as batchControls } from '../batch/control.js';
import { header as batchHeaders } from '../batch/header.js';
import EntryAddenda from '../entry-addenda/EntryAddenda.js';
import { fields as addendaFields } from '../entry-addenda/fields.js';
import Entry from '../entry/Entry.js';
import { EntryOptions } from '../entry/entryTypes.js';
import { fields as entryFields } from '../entry/fields.js';
import File from './File.js';
import { FileControls, FileHeaders, FileOptions } from './FileTypes.js';
import { fileControls } from './control.js';
import { fileHeaders } from './header.js';

export default class NACHParser {
  /**
   * @param {string} filePath 
   * @param {boolean} debug
   * @returns {Promise<File>}
   */
  static async parseFile(filePath: string, debug: boolean = false): Promise<File> {
    try {
      const data = await readFile(filePath, { encoding: 'utf-8' });
      const file = await this.parse(data, debug);
      if (!file) throw new Error('File could not be parsed');
      return file;
    } catch (err) {
      console.error('[node-natcha::File:parseFile] - Error', err);
      throw err;
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

      let lines = str.split('\n');

      if (lines.length <= 1) {
        lines = [];
        for (let i = 0; i < str.length; i += 94) {
          lines.push(str.substr(i, 94));
        }
      }

      const file: Partial<FileOptions> = {};
      const batches: Array<Partial<BatchOptions> & { entry: Array<Entry> }> = [];
      let batchIndex = 0;
      let hasAddenda = false;

      lines.forEach((line) => {
        try {
          if (!line || !line.length) return;
          line = line.trim();
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
          console.error('[node-natcha::File:parse] - Error', error)
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
}
module.exports = NACHParser;
