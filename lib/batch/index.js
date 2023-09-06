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
// Batch
const moment_1 = __importDefault(require("moment"));
const utils_1 = require("./../utils");
const validate_1 = require("./../validate");
const control_1 = require("./control");
const header_1 = require("./header");
const overrides_js_1 = require("../overrides.js");
class Batch {
    constructor(options, autoValidate) {
        this._entries = [];
        // Allow the batch header/control defaults to be override if provided
        this.header = (options.header) ? Object.assign(Object.assign({}, options.header), header_1.header) : Object.assign({}, header_1.header);
        this.control = (options.control)
            ? Object.assign(Object.assign({}, options.control), control_1.control)
            : Object.assign({}, control_1.control);
        // Configure high-level overrides (these override the low-level settings if provided)
        (0, utils_1.overrideLowLevel)(overrides_js_1.highLevelHeaderOverrides, options, this);
        (0, utils_1.overrideLowLevel)(overrides_js_1.highLevelControlOverrides, options, this);
        if (autoValidate !== false) {
            // Validate the routing number (ABA) before slicing
            (0, validate_1.validateRoutingNumber)((0, utils_1.computeCheckDigit)(options.originatingDFI));
        }
        if (options.companyName) {
            this.header.companyName.value = options.companyName.slice(0, this.header.companyName.width);
        }
        if (options.companyEntryDescription) {
            this.header.companyEntryDescription.value = options.companyEntryDescription.slice(0, this.header.companyEntryDescription.width);
        }
        if (options.companyDescriptiveDate) {
            this.header.companyDescriptiveDate.value = options.companyDescriptiveDate.slice(0, this.header.companyDescriptiveDate.width);
        }
        if (options.effectiveEntryDate) {
            if (typeof options.effectiveEntryDate == 'string') {
                options.effectiveEntryDate = (0, moment_1.default)(options.effectiveEntryDate, 'YYMMDD').toDate();
            }
            this.header.effectiveEntryDate.value = (0, utils_1.formatDate)(options.effectiveEntryDate);
        }
        if (options.originatingDFI) {
            this.header.originatingDFI.value = (0, utils_1.computeCheckDigit)(options.originatingDFI).slice(0, this.header.originatingDFI.width);
        }
        // Set control values which use the same header values
        this.control.serviceClassCode.value = this.header.serviceClassCode.value;
        this.control.companyIdentification.value = this.header.companyIdentification.value;
        this.control.originatingDFI.value = this.header.originatingDFI.value;
        if (autoValidate !== false) {
            // Perform validation on all the passed values
            this._validate();
        }
    }
    _validate() {
        // Validate required fields have been passed
        (0, validate_1.validateRequiredFields)(this.header);
        // Validate the batch's ACH service class code
        (0, validate_1.validateACHServiceClassCode)(this.header.serviceClassCode.value);
        // Validate field lengths
        (0, validate_1.validateLengths)(this.header);
        // Validate datatypes
        (0, validate_1.validateDataTypes)(this.header);
        // Validate required fields have been passed
        (0, validate_1.validateRequiredFields)(this.control);
        // Validate field lengths
        (0, validate_1.validateLengths)(this.control);
        // Validate datatypes
        (0, validate_1.validateDataTypes)(this.control);
    }
    addEntry(entry) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            // Increment the addendaCount of the batch
            if (typeof this.control.addendaCount.value === 'number')
                this.control.addendaCount.value += entry.getRecordCount();
            // Add the new entry to the entries array
            this._entries.push(entry);
            // Update the batch values like total debit and credit $ amounts
            let entryHash = 0;
            let totalDebit = 0;
            let totalCredit = 0;
            // (22, 23, 24, 27, 28, 29, 32, 33, 34, 37, 38 & 39)
            const creditCodes = ['22', '23', '24', '32', '33', '34'];
            const debitCodes = ['27', '28', '29', '37', '38', '39'];
            try {
                try {
                    for (var _d = true, _e = __asyncValues(this._entries), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const entry = _c;
                        entryHash += Number(entry.fields.receivingDFI.value);
                        if (typeof entry.fields.amount.value === 'number') {
                            if ((creditCodes).includes(entry.fields.transactionCode.value)) {
                                totalCredit += entry.fields.amount.value;
                            }
                            else if (debitCodes.includes(entry.fields.transactionCode.value)) {
                                totalDebit += entry.fields.amount.value;
                            }
                            else {
                                console.log('Transaction codes did not match or are not supported yet (unsupported status codes include: 23, 24, 28, 29, 33, 34, 38, 39)');
                            }
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            catch (error) {
                this.control.totalCredit.value = totalCredit;
                this.control.totalDebit.value = totalDebit;
                // Add up the positions 4-11 and compute the total. Slice the 10 rightmost digits.
                this.control.entryHash.value = Number(entryHash.toString().slice(-10));
                console.error('Transaction codes did not match or are not supported yet (unsupported status codes include: 23, 24, 28, 29, 33, 34, 38, 39)');
            }
        });
    }
    getEntries() { return this._entries; }
    generateHeader(cb) {
        return (0, utils_1.generateString)(this.header, function (string) { cb(string); });
    }
    generateControl(cb) {
        return (0, utils_1.generateString)(this.control, function (string) { cb(string); });
    }
    generateEntries(cb) {
        let result = '';
        for (const entry of this._entries) {
            entry.generateString((string) => { result += string + (0, utils_1.newLineChar)(); });
        }
        cb(result);
    }
    generateString(cb) {
        this.generateHeader((headerString) => {
            this.generateEntries((entryString) => {
                this.generateControl((controlString) => {
                    cb(headerString + (0, utils_1.newLineChar)() + entryString + controlString);
                });
            });
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
        if (field in this.header && this.isAHeaderField(field))
            return this.header[field]['value'];
        // If the control has the field, return the value
        if (field in this.control && this.isAControlField(field))
            return this.control[field]['value'];
        throw new Error(`Field ${field} not found in Batch header or control.`);
    }
    set(field, value) {
        // If the header has the field, set the value
        if (field in this.header && this.isAHeaderField(field)) {
            if (field === 'serviceClassCode') {
                this.header[field].value = value;
            }
            else {
                this.header[field]['value'] = value;
            }
        }
        // If the control has the field, set the value
        if (field in this.control && this.isAControlField(field)) {
            this.control[field]['value'] = value;
        }
    }
}
exports.default = Batch;
module.exports = Batch;
