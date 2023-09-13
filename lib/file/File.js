"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importStar(require("fs/promises"));
const Batch_js_1 = __importDefault(require("../batch/Batch.js"));
const control_js_1 = require("../batch/control.js");
const header_js_1 = require("../batch/header.js");
const achParser_js_1 = __importDefault(require("../class/achParser.js"));
const EntryAddenda_js_1 = __importDefault(require("../entry-addenda/EntryAddenda.js"));
const fields_js_1 = require("../entry-addenda/fields.js");
const Entry_js_1 = __importDefault(require("../entry/Entry.js"));
const fields_js_2 = require("../entry/fields.js");
const utils_js_1 = require("../utils.js");
const control_js_2 = require("./control.js");
const header_js_2 = require("./header.js");
const validate_js_1 = __importDefault(require("../validate.js"));
class File extends achParser_js_1.default {
    constructor(options, autoValidate = true, debug = false) {
        super({ options, name: 'File', debug });
        this._batches = [];
        this._batchSequenceNumber = 0;
        if (('header' in this && 'control' in this)
            && this.typeGuards.isFileOverrides(this.overrides)
            && this.typeGuards.isFileOptions(this.options)) {
            this.overrides.forEach((field) => {
                if (field in this.options && this.options[field] !== undefined) {
                    const value = this.options[field];
                    if (value !== undefined)
                        this.set(field, value);
                }
            });
        }
        // This is done to make sure we have a 9-digit routing number
        if (options.immediateDestination) {
            this.header.immediateDestination.value = (0, utils_js_1.computeCheckDigit)(options.immediateDestination);
        }
        this._batchSequenceNumber = Number(options.batchSequenceNumber) || 0;
        if (autoValidate)
            this.validate();
    }
    validate() {
        const { validateDataTypes, validateLengths } = (0, validate_js_1.default)(this);
        // Validate header field lengths
        validateLengths(this.header);
        // Validate header data types
        validateDataTypes(this.header);
        // Validate control field lengths
        validateLengths(this.control);
        // Validate header data types
        validateDataTypes(this.control);
    }
    addBatch(batch) {
        // Set the batch number on the header and control records
        batch.header.batchNumber.value = this._batchSequenceNumber;
        batch.control.batchNumber.value = this._batchSequenceNumber;
        // Increment the batchSequenceNumber
        this._batchSequenceNumber++;
        // Add the batch to the file
        this._batches.push(batch);
    }
    getBatches() { return this._batches; }
    generatePaddedRows(rows) {
        let paddedRows = '';
        for (let i = 0; i < rows; i++) {
            paddedRows += '\r\n' + (0, utils_js_1.pad)('', 94, false, '9');
        }
        return paddedRows;
    }
    generateHeader() { return (0, utils_js_1.generateString)(this.header); }
    generateControl() { return (0, utils_js_1.generateString)(this.control); }
    generateBatches() {
        var _a;
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
                entry.fields.traceNumber.value = (_a = entry.fields.traceNumber.value) !== null && _a !== void 0 ? _a : (this.header.immediateOrigin.value.slice(0, 8) + (0, utils_js_1.pad)(addendaCount, 7, false, '0'));
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
        this.control.blockCount.value = (0, utils_js_1.getNextMultiple)(rows, 10) / 10;
        // Slice the 10 rightmost digits.
        this.control.entryHash.value = Number(entryHash.toString().slice(-10));
        return { result, rows };
    }
    generateFile() {
        return new Promise((resolve, reject) => {
            try {
                // Generate the batches
                const { result: batchString, rows } = this.generateBatches();
                // Generate the file header
                const header = this.generateHeader();
                // Generate the file control
                const control = this.generateControl();
                // Generate the padded rows
                const paddedRows = this.generatePaddedRows((0, utils_js_1.getNextMultipleDiff)(rows, 10));
                // Resolve the promise with the full file string
                resolve(header + '\r\n' + batchString + control + paddedRows);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    writeFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fileString = yield this.generateFile();
                return yield (0, promises_1.writeFile)(path, fileString);
            }
            catch (error) {
                console.error('[node-natcha::File:writeFile] - Error', error);
                throw error;
            }
        });
    }
    static parseFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield promises_1.default.readFile(filePath, { encoding: 'utf-8' });
                return yield this.parse(data);
            }
            catch (err) {
                console.error('[node-natcha::File:parseFile] - Error', err);
                throw err;
            }
        });
    }
    static parseLine(str, object) {
        let pos = 0;
        return Object.keys(object).reduce((result, key) => {
            const field = object[key];
            result[key] = str.substring(pos, pos + field.width).trim();
            pos += field.width;
            return result;
        }, {});
    }
    static parse(str) {
        return new Promise((resolve, reject) => {
            if (!str || !str.length) {
                reject('Input string is empty');
                return;
            }
            const lines = (str.length <= 1)
                ? Array.from({ length: Math.ceil(str.length / 94) }, (_, i) => str.substr(i * 94, 94))
                : str.split('\n');
            const file = {};
            const batches = [];
            let batchIndex = 0;
            let hasAddenda = false;
            lines.forEach((line) => {
                if (!line || !line.length)
                    return;
                const lineType = parseInt(line[0]);
                if (lineType === 1)
                    file.header = this.parseLine(line, header_js_2.fileHeaders);
                if (lineType === 9)
                    file.control = this.parseLine(line, control_js_2.fileControls);
                if (lineType === 5) {
                    batches.push({
                        header: this.parseLine(line, header_js_1.header),
                        entry: [],
                    });
                }
                if (lineType === 8) {
                    batches[batchIndex].control = this.parseLine(line, control_js_1.control);
                    batchIndex++;
                }
                if (lineType === 6) {
                    batches[batchIndex].entry.push(new Entry_js_1.default(this.parseLine(line, fields_js_2.fields)));
                }
                if (lineType === 7) {
                    batches[batchIndex]
                        .entry[batches[batchIndex].entry.length - 1]
                        .addAddenda(new EntryAddenda_js_1.default(this.parseLine(line, fields_js_1.fields)));
                    hasAddenda = true;
                }
            });
            if (!file.header || !file.control) {
                reject('File records parse error');
                return;
            }
            if (!batches.length) {
                reject('No batches found');
                return;
            }
            try {
                const nachFile = new File(file.header, !hasAddenda);
                batches.forEach((batchOb) => {
                    const batch = new Batch_js_1.default(batchOb.header);
                    batchOb.entry.forEach((entry) => {
                        batch.addEntry(entry);
                    });
                    nachFile.addBatch(batch);
                });
                resolve(nachFile);
            }
            catch (e) {
                reject(e);
            }
        });
    }
    isAHeaderField(field) {
        return Object.keys(this.header).includes(field);
    }
    isAControlField(field) {
        return Object.keys(this.control).includes(field);
    }
    get(field) {
        // If the header has the field, return the value
        if (field in this.header && this.isAHeaderField(field)) {
            return this.header[field]['value'];
        }
        // If the control has the field, return the value
        if (field in this.control && this.isAControlField(field))
            return this.control[field]['value'];
        throw new Error(`Field ${field} not found in Batch header or control.`);
    }
    set(field, value) {
        // If the header has the field, set the value
        if (field in this.header && this.isAHeaderField(field)) {
            return this.header[field].value = value;
        }
        // If the control has the field, set the value
        if (field in this.control && this.isAControlField(field)) {
            return this.control[field]['value'] = value;
        }
    }
}
exports.default = File;
module.exports = File;
