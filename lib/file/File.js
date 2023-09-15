"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const achParser_js_1 = __importDefault(require("../class/achParser.js"));
const overrides_js_1 = require("../overrides.js");
const utils_js_1 = require("../utils.js");
const validate_js_1 = __importDefault(require("../validate.js"));
const control_js_1 = require("./control.js");
const header_js_1 = require("./header.js");
class File extends achParser_js_1.default {
    /**
     *
     * @param {FileOptions} options
     * @param {boolean} autoValidate
     * @param {boolean} debug
     */
    constructor(options, autoValidate = true, debug = false) {
        super({ options, name: 'File', debug });
        this._batches = [];
        this._batchSequenceNumber = 0;
        this.overrides = overrides_js_1.highLevelFileOverrides;
        this.header = options.header
            ? Object.assign(Object.assign({}, options.header), header_js_1.fileHeaders) : Object.assign({}, header_js_1.fileHeaders);
        this.control = options.control
            ? Object.assign(Object.assign({}, options.control), control_js_1.fileControls) : Object.assign({}, control_js_1.fileControls);
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
        var _a, e_1, _b, _c;
        var _d;
        return __awaiter(this, void 0, void 0, function* () {
            let result = '';
            let rows = 2;
            let entryHash = 0;
            let addendaCount = 0;
            let totalDebit = 0;
            let totalCredit = 0;
            try {
                for (var _e = true, _f = __asyncValues(this._batches), _g; _g = yield _f.next(), _a = _g.done, !_a; _e = true) {
                    _c = _g.value;
                    _e = false;
                    const batch = _c;
                    totalDebit += batch.control.totalDebit.value;
                    totalCredit += batch.control.totalCredit.value;
                    for (const entry of batch._entries) {
                        entry.fields.traceNumber.value = (_d = entry.fields.traceNumber.value) !== null && _d !== void 0 ? _d : (this.header.immediateOrigin.value.slice(0, 8) + (0, utils_js_1.pad)(addendaCount, 7, false, '0'));
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
                        const batchString = yield batch.generateString();
                        result += batchString + '\r\n';
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_e && !_a && (_b = _f.return)) yield _b.call(_f);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this.control.totalDebit.value = totalDebit;
            this.control.totalCredit.value = totalCredit;
            this.control.addendaCount.value = addendaCount;
            this.control.blockCount.value = (0, utils_js_1.getNextMultiple)(rows, 10) / 10;
            // Slice the 10 rightmost digits.
            this.control.entryHash.value = Number(entryHash.toString().slice(-10));
            return { result, rows };
        });
    }
    generateFile() {
        return __awaiter(this, void 0, void 0, function* () {
            const { result: batchString, rows } = yield this.generateBatches();
            // Generate the file header
            const header = yield this.generateHeader();
            // Generate the file control
            const control = yield this.generateControl();
            // Generate the padded rows
            const paddedRows = this.generatePaddedRows((0, utils_js_1.getNextMultipleDiff)(rows, 10));
            // Resolve the promise with the full file string
            return `${header}\r\n${batchString}${control}${paddedRows}`;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9maWxlL0ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMENBQXdDO0FBRXhDLHlFQUErQztBQUMvQyxrREFBeUQ7QUFDekQsMENBQTJHO0FBQzNHLGlFQUF5QztBQUV6Qyw2Q0FBNEM7QUFDNUMsMkNBQTBDO0FBRTFDLE1BQXFCLElBQUssU0FBUSxzQkFBa0I7SUFPbEQ7Ozs7O09BS0c7SUFDSCxZQUFZLE9BQW9CLEVBQUUsZUFBd0IsSUFBSSxFQUFFLFFBQWlCLEtBQUs7UUFDcEYsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQVZsQyxhQUFRLEdBQWlCLEVBQUUsQ0FBQztRQUM1Qix5QkFBb0IsR0FBRyxDQUFDLENBQUM7UUFXL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxxQ0FBc0IsQ0FBQztRQUV4QyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNO1lBQzFCLENBQUMsaUNBQU0sT0FBTyxDQUFDLE1BQU0sR0FBSyx1QkFBVyxFQUNyQyxDQUFDLG1CQUFNLHVCQUFXLENBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPO1lBQzVCLENBQUMsaUNBQU0sT0FBTyxDQUFDLE9BQU8sR0FBSyx5QkFBWSxFQUN2QyxDQUFDLG1CQUFNLHlCQUFZLENBQUUsQ0FBQztRQUV4QixJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDO2VBQ3BDLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7ZUFDL0MsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUMvQztZQUNDLElBQUksQ0FBQyxTQUFT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