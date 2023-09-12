"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const achParser_js_1 = __importDefault(require("../class/achParser.js"));
const error_js_1 = __importDefault(require("../error.js"));
const utils_js_1 = require("../utils.js");
const ACHTransactionCodes = ['22', '23', '24', '27', '28', '29', '32', '33', '34', '37', '38', '39'];
class Entry extends achParser_js_1.default {
    constructor(options, autoValidate = true, debug = false) {
        super({ options: options, name: 'Entry', debug });
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
        console.info({ traceNumber });
        // Add indicator to Entry record
        this.set('addendaId', '1');
        // Set corresponding fields on Addenda
        entryAddenda.set('addendaSequenceNumber', this._addendas.length + 1);
        entryAddenda.set('entryDetailSequenceNumber', traceNumber);
        // Add the new entryAddenda to the addendas array
        this._addendas.push(entryAddenda);
    }
    getAddendas() { return this._addendas; }
    getRecordCount() { return this._addendas.length + 1; }
    _validate() {
        const { validations } = this;
        // Validate required fields
        validations.validateRequiredFields(this.fields);
        // Validate the ACH code passed
        if (this.fields.addendaId.value == '0') {
            if (this.fields.transactionCode.value) {
                if (this.fields.transactionCode.value.length !== 2 || ACHTransactionCodes.includes(this.fields.transactionCode.value) === false) {
                    throw new error_js_1.default({
                        name: 'ACH Transaction Code Error',
                        message: `The ACH transaction code ${this.fields.transactionCode.value} is invalid. Please pass a valid 2-digit transaction code.`
                    });
                }
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
                //  validateACHAddendaCode(this.fields.transactionCode.value);
                //! - this didn't do anything in the base library
            }
        }
        // Validate the routing number
        validations.validateRoutingNumber((0, utils_js_1.addNumericalString)(this.fields.receivingDFI.value, this.fields.checkDigit.value));
        // Validate header field lengths
        validations.validateLengths(this.fields);
        // Validate header data types
        validations.validateDataTypes(this.fields);
    }
    generateString() {
        const result = (0, utils_js_1.generateString)(this.fields);
        return [
            result,
            this._addendas.map(((addenda) => addenda.generateString())).join('\n')
        ].join('\n');
    }
    get(field) {
        return this.fields[field]['value'];
    }
    set(field, value) {
        if (this.fields[field])
            this.fields[field]['value'] = value;
    }
}
exports.default = Entry;
module.exports = Entry;
