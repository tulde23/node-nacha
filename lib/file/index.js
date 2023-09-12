"use strict";
// File
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(require("../utils.js"));
const index_js_1 = __importDefault(require("../batch/index.js"));
const Entry_js_1 = __importDefault(require("../entry/Entry.js"));
const control_js_1 = require("./control.js");
const header_js_1 = require("./header.js");
const File_js_1 = __importDefault(require("./File.js"));
File_js_1.default.prototype.get = function (field) {
    // If the header has the field, return the value
    if (this.header[field]) {
        return this.header[field]['value'];
    }
    // If the control has the field, return the value
    if (this.control[field]) {
        return this.control[field]['value'];
    }
};
File_js_1.default.prototype.set = function (field, value) {
    // If the header has the field, set the value
    if (this.header[field]) {
        this.header[field]['value'] = value;
    }
    // If the control has the field, set the value
    if (this.control[field]) {
        this.control[field]['value'] = value;
    }
};
File_js_1.default.prototype.generateBatches = function (done1) {
    const self = this;
    let result = '';
    let rows = 2;
    let entryHash = 0;
    let addendaCount = 0;
    let totalDebit = 0;
    let totalCredit = 0;
    async.each(this._batches, function (batch, done2) {
        totalDebit += batch.control.totalDebit.value;
        totalCredit += batch.control.totalCredit.value;
        async.each(batch._entries, function (entry, done3) {
            entry.fields.traceNumber.value = (entry.fields.traceNumber.value) ? entry.fields.traceNumber.value : self.header.immediateOrigin.value.slice(0, 8) + utils.pad(addendaCount, 7, false, '0');
            entryHash += Number(entry.fields.receivingDFI.value);
            // Increment the addenda and block count
            addendaCount++;
            rows++;
            done3();
        }, function (err) {
            // Only iterate and generate the batch if there is at least one entry in the batch
            if (batch._entries.length > 0) {
                // Increment the addendaCount of the batch
                self.control.batchCount.value++;
                // Bump the number of rows only for batches with at least one entry
                rows = rows + 2;
                // Generate the batch after we've added the trace numbers
                batch.generateString(function (batchString) {
                    result += batchString + utils.newLineChar();
                    done2();
                });
            }
            else {
                done2();
            }
        });
    }, function (err) {
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
File_js_1.default.prototype.generateFile = function (cb) {
    const self = this;
    return new Promise(function (resolve) {
        self.generateHeader(function (headerString) {
            self.generateBatches(function (batchString, rows) {
                self.generateControl(function (controlString) {
                    // These must be within this callback otherwise rows won't be calculated yet
                    const paddedRows = utils.getNextMultipleDiff(rows, 10);
                    self.generatePaddedRows(paddedRows, function (paddedString) {
                        const str = headerString + utils.newLineChar() + batchString + controlString + paddedString;
                        cb && cb(undefined, str);
                        resolve(str);
                    });
                });
            });
        });
    });
};
File_js_1.default.prototype.writeFile = function (path, cb) {
    const self = this;
    return new Promise(function (resolve, reject) {
        self.generateFile(function (err, fileSting) {
            if (err) {
                reject(err);
                return cb && cb(err);
            }
            fs.writeFile(path, fileSting, function (err) {
                if (err) {
                    reject(err);
                    return cb && cb(err);
                }
                resolve();
            });
        });
    });
};
File_js_1.default.parseFile = function (filePath, cb) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, function (err, data) {
            if (err) {
                reject(err);
                return cb && cb(err);
            }
            resolve(File_js_1.default.parse(data.toString(), cb));
        });
    });
};
File_js_1.default.parse = function (str, cb) {
    return new Promise(function (resolve, reject) {
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
        const batches = [];
        let batchIndex = 0;
        let hasAddenda = false;
        lines.forEach(function (line) {
            if (!line || !line.length) {
                return;
            }
            switch (parseInt(line[0])) {
                case 1:
                    file.header = utils.parseLine(line, (0, header_js_1.fileHeader)());
                    break;
                case 9:
                    file.control = utils.parseLine(line, control_js_1.fileControl);
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
                    batches[batchIndex].entry.push(new Entry_js_1.default(utils.parseLine(line, entryFields)));
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
            let nachFile;
            if (!hasAddenda) {
                nachFile = new File_js_1.default(file.header);
            }
            else {
                nachFile = new File_js_1.default(file.header, false);
            }
            batches.forEach(function (batchOb) {
                const batch = new index_js_1.default(batchOb.header);
                batchOb.entry.forEach(function (entry) {
                    batch.addEntry(entry);
                });
                nachFile.addBatch(batch);
            });
            cb && cb(undefined, nachFile);
            resolve(nachFile);
        }
        catch (e) {
            reject(e);
            return cb && cb(e);
        }
    });
};
module.exports = File_js_1.default;
