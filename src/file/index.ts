// File

import * as utils from '../utils.js';
import Batch from '../batch/index.js';
import Entry from '../entry/Entry.js';
import { fileControl } from './control.js';
import { fileHeader } from './header.js';
import File from './File.js'

File.prototype.get = function(field: string | number) {

  // If the header has the field, return the value
  if (this.header[field]) {
    return this.header[field]['value'];
  }

  // If the control has the field, return the value
  if (this.control[field]) {
    return this.control[field]['value'];
  }
};

File.prototype.set = function(field: string | number, value: any) {

  // If the header has the field, set the value
  if (this.header[field]) {
    this.header[field]['value'] = value;
  }

  // If the control has the field, set the value
  if (this.control[field]) {
    this.control[field]['value'] = value;
  }
};


File.prototype.generateBatches = function(done1: (arg0: string, arg1: number) => void) {
  const self = this;

  let result = '';
  let rows = 2;

  let entryHash = 0;
  let addendaCount = 0;

  let totalDebit = 0;
  let totalCredit = 0;

  async.each(this._batches, function(batch: { control: { totalDebit: { value: number; }; totalCredit: { value: number; }; }; _entries: string | any[]; generateString: (arg0: (batchString: any) => void) => void; }, done2: () => void) {
    totalDebit += batch.control.totalDebit.value;
    totalCredit += batch.control.totalCredit.value;

    async.each(batch._entries, function(entry: { fields: { traceNumber: { value: any; }; receivingDFI: { value: any; }; }; }, done3: () => void) {
      entry.fields.traceNumber.value = (entry.fields.traceNumber.value) ? entry.fields.traceNumber.value : self.header.immediateOrigin.value.slice(0, 8) + utils.pad(addendaCount, 7, false, '0');
      entryHash += Number(entry.fields.receivingDFI.value);

      // Increment the addenda and block count
      addendaCount++;
      rows++;

      done3();
    }, function(err: any) {

      // Only iterate and generate the batch if there is at least one entry in the batch
      if (batch._entries.length > 0) {

        // Increment the addendaCount of the batch
        self.control.batchCount.value++;

        // Bump the number of rows only for batches with at least one entry
        rows = rows + 2;

        // Generate the batch after we've added the trace numbers
        batch.generateString(function(batchString: any) {
          result += batchString + utils.newLineChar();
          done2();
        });
      } else {
        done2();
      }
    });
  }, function(err: any) {
    self.control.totalDebit.value = totalDebit;
    self.control.totalCredit.value = totalCredit;

    self.control.addendaCount.value = addendaCount;
    self.control.blockCount.value = utils.getNextMultiple(rows, 10) / 10;

    // Slice the 10 rightmost digits.
    self.control.entryHash.value = entryHash.toString().slice(-10);

    // Pass the result string as well as the number of rows back
    done1(result, rows);
  });
};

File.prototype.generateFile = function(cb: (arg0: undefined, arg1: any) => any) {
  const self = this;
  return new Promise(function(resolve) {
    self.generateHeader(function(headerString: any) {
      self.generateBatches(function(batchString: any, rows: any) {
        self.generateControl(function(controlString: any) {

          // These must be within this callback otherwise rows won't be calculated yet
          const paddedRows = utils.getNextMultipleDiff(rows, 10);

          self.generatePaddedRows(paddedRows, function(paddedString: any) {
            const str = headerString + utils.newLineChar() + batchString + controlString + paddedString;
            cb && cb(undefined, str);
            resolve(str);
          });
        });
      })
    });
  })
};

File.prototype.writeFile = function(path: any, cb: (arg0: any) => any) {
  const self = this;
  return new Promise(function(resolve, reject) {
    self.generateFile(function(err: any, fileSting: any) {
      if (err) {
        reject(err);
        return cb && cb(err);
      }
      fs.writeFile(path, fileSting, function(err: any) {
        if (err) {
          reject(err);
          return cb && cb(err);
        }
        resolve();
      })
    })
  });
};

File.parseFile = function(filePath: any, cb: (arg0: any) => any) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filePath, function(err: any, data: { toString: () => any; }) {
      if (err) {
        reject(err);
        return cb && cb(err);
      }
      resolve(File.parse(data.toString(), cb));
    });
  })
}

File.parse = function(str: string, cb: (arg0: unknown, arg1: File | undefined) => any) {
  return new Promise(function(resolve, reject) {
    if (!str || !str.length) {
      reject('Input string is empty');
      return cb && cb('Input string is empty');
    }
    let lines = str.split('\n');
    if (lines.length <= 1) {
      lines = [];
      for (let i = 0; i < str.length; i += 94) {
        lines.push(str.substr(i, 94));
      }
    }
    const file = {};
    const batches: { entry: string | any[]; }[] = [];
    let batchIndex = 0;
    let hasAddenda = false;
    lines.forEach(function(line: string | any[]) {
      if (!line || !line.length) {
        return;
      }
      switch (parseInt(line[0])) {
        case 1:
          file.header = utils.parseLine(line, fileHeader());
          break;
        case 9:
          file.control = utils.parseLine(line, fileControl);
          break;
        case 5:
          batches.push({
            header: utils.parseLine(line, batchHeader),
            entry: [],
            addenda: []
          });
          break;
        case 8:
          batches[batchIndex].control = utils.parseLine(line, batchControl);
          batchIndex++;
          break;
        case 6:
          batches[batchIndex].entry.push(new Entry(utils.parseLine(line, entryFields)));
          break;
        case 7:
          batches[batchIndex]
            .entry[batches[batchIndex].entry.length - 1]
            .addAddenda(new Addenda(utils.parseLine(line, addendaFields)));
          hasAddenda = true;
          break;
      }
    });
    if (!file.header || !file.control) {
      reject('File records parse error');
      return cb && cb('File records parse error');
    }
    if (!batches || !batches.length) {
      reject('No batches found');
      return cb && cb('No batches found');
    }
    try {
      let nachFile: unknown;
      if (!hasAddenda) {
        nachFile = new File(file.header);
      } else {
        nachFile = new File(file.header, false);
      }

      batches.forEach(function(batchOb) {
        const batch = new Batch(batchOb.header);
        batchOb.entry.forEach(function(entry: any) {
          batch.addEntry(entry);
        });
        nachFile.addBatch(batch);
      })
      cb && cb(undefined, nachFile);
      resolve(nachFile);
    } catch (e) {
      reject(e);
      return cb && cb(e);
    }
  })
}

module.exports = File;
