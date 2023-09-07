"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./../utils");
const validate_1 = require("./../validate");
const fields_js_1 = require("./fields.js");
const overrides_js_1 = require("../overrides.js");
const error_js_1 = __importDefault(require("../error.js"));
class Entry {
    constructor(options, autoValidate) {
        this._addendas = [];
        // Allow the file header defaults to be override if provided
        this.fields = options.fields
            ? Object.assign(Object.assign({}, options.fields), fields_js_1.fields)
            : Object.assign({}, fields_js_1.fields);
        // Set our high-level values
        (0, utils_1.overrideLowLevel)(overrides_js_1.highLevelFieldOverrides, options, this);
        // Some values need special coercing, so after they've been set by overrideLowLevel() we override them
        if (options.receivingDFI) {
            this.fields.receivingDFI.value = (0, utils_1.computeCheckDigit)(options.receivingDFI).slice(0, -1);
            this.fields.checkDigit.value = (0, utils_1.computeCheckDigit)(options.receivingDFI).slice(-1);
        }
        if (options.DFIAccount) {
            this.fields.DFIAccount.value = options.DFIAccount.slice(0, this.fields.DFIAccount.width);
        }
        if (options.amount) {
            this.fields.amount.value = Number(options.amount);
        }
        if (options.idNumber) {
            this.fields.idNumber.value = options.idNumber;
        }
        if (options.individualName) {
            this.fields.individualName.value = options.individualName.slice(0, this.fields.individualName.width);
        }
        if (options.discretionaryData) {
            this.fields.discretionaryData.value = options.discretionaryData;
        }
        if (autoValidate !== false) {
            // Validate required fields have been passed
            this._validate();
        }
    }
    addAddenda(entryAddenda) {
        const traceNumber = this.get('traceNumber');
        // Add indicator to Entry record
        this.set('addendaId', '1');
        // Set corresponding fields on Addenda
        entryAddenda.set('addendaSequenceNumber', `${this._addendas.length + 1}`);
        if (typeof traceNumber === 'number') {
            entryAddenda.set('entryDetailSequenceNumber', traceNumber);
        }
        else {
            entryAddenda.set('entryDetailSequenceNumber', Number(traceNumber));
        }
        // Add the new entryAddenda to the addendas array
        this._addendas.push(entryAddenda);
    }
    getAddendas() { return this._addendas; }
    getRecordCount() { return this._addendas.length + 1; }
    generateString(cb) {
        try {
            this._addendas.map((({ fields }) => {
                (0, utils_1.generateString)(fields, function (string) { done(null, string); });
            }));
        }
        catch (error) {
            (0, utils_1.generateString)(this.fields, function (string) {
                cb([string].concat(addendaStrings).join('\n'));
            });
        }
    }
    _validate() {
        // Validate required fields
        (0, validate_1.validateRequiredFields)(this.fields);
        // Validate the ACH code passed
        if (this.fields.addendaId.value == '0') {
            if (this.fields.transactionCode.value) {
                (0, validate_1.validateACHCode)(this.fields.transactionCode.value);
            }
            else {
                throw new error_js_1.default({
                    name: 'ACH Transaction Code Error',
                    message: `The ACH transaction code must be provided when addenda ID === '0'. Please pass a valid 2-digit transaction code.`
                });
            }
        }
        else {
            if (this.fields.transactionCode.value) {
                (0, validate_1.validateACHAddendaCode)(this.fields.transactionCode.value);
            }
        }
        // Validate the routing number
        (0, validate_1.validateRoutingNumber)(Number(this.fields.receivingDFI.value) + Number(this.fields.checkDigit.value));
        // Validate header field lengths
        (0, validate_1.validateLengths)(this.fields);
        // Validate header data types
        (0, validate_1.validateDataTypes)(this.fields);
    }
    get(category) {
        // If the header has it, return that (header takes priority)
        if (this.fields[category])
            return this.fields[category].value;
    }
    set(category, value) {
        console.debug({ category, value });
        // If the header has the field, set the value
        if (this.fields[category])
            this.fields[category]['value'] = value;
    }
}
exports.default = Entry;
module.exports = Entry;
