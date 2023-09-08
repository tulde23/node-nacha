"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_js_1 = __importDefault(require("../error.js"));
const utils_js_1 = require("../utils.js");
const validate_js_1 = require("../validate.js");
const achParser_js_1 = __importDefault(require("./achParser.js"));
class Entry extends achParser_js_1.default {
    constructor(options, autoValidate = true) {
        super({ options, name: 'Entry' });
        this._addendas = [];
        // Some values need special coercing, so after they've been set by overrideLowLevel() we override them
        if (options.receivingDFI) {
            this.fields.receivingDFI.value = (0, utils_js_1.computeCheckDigit)(options.receivingDFI).slice(0, -1);
            this.fields.checkDigit.value = (0, utils_js_1.computeCheckDigit)(options.receivingDFI).slice(-1);
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
    _validate() {
        // Validate required fields
        (0, validate_js_1.validateRequiredFields)(this.fields);
        // Validate the ACH code passed
        if (this.fields.addendaId.value == '0') {
            if (this.fields.transactionCode.value) {
                (0, validate_js_1.validateACHCode)(this.fields.transactionCode.value);
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
                (0, validate_js_1.validateACHAddendaCode)(this.fields.transactionCode.value);
            }
        }
        // Validate the routing number
        (0, validate_js_1.validateRoutingNumber)(Number(this.fields.receivingDFI.value) + Number(this.fields.checkDigit.value));
        // Validate header field lengths
        (0, validate_js_1.validateLengths)(this.fields);
        // Validate header data types
        (0, validate_js_1.validateDataTypes)(this.fields);
    }
    generateString() {
        return this._addendas.map(((addenda) => addenda.generateString()));
    }
}
exports.default = Entry;
module.exports = Entry;
