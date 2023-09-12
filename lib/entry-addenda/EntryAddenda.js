"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const achParser_js_1 = __importDefault(require("../class/achParser.js"));
const error_js_1 = __importDefault(require("../error.js"));
const utils_js_1 = require("../utils.js");
class EntryAddenda extends achParser_js_1.default {
    constructor(options, autoValidate = true, debug = false) {
        super({ options, name: 'EntryAddenda', debug });
        // Some values need special coercing, so after they've been set by overrideLowLevel() we override them
        if (options.returnCode) {
            this.fields.returnCode.value = options.returnCode.slice(0, this.fields.returnCode.width);
        }
        if (options.paymentRelatedInformation) {
            this.fields.paymentRelatedInformation.value = options.paymentRelatedInformation.slice(0, this.fields.paymentRelatedInformation.width);
        }
        if (options.addendaSequenceNumber) {
            this.fields.addendaSequenceNumber.value = options.addendaSequenceNumber;
        }
        if (options.entryDetailSequenceNumber) {
            this.fields.entryDetailSequenceNumber.value = options.entryDetailSequenceNumber.toString().slice(0 - this.fields.entryDetailSequenceNumber.width); // last n digits. pass 
        }
        // Validate required fields have been passed
        if (autoValidate)
            this.validate();
    }
    validate() {
        const { validations } = this;
        // Validate required fields
        validations.validateRequiredFields(this.fields);
        const ACHAddendaTypeCodes = ['02', '05', '98', '99'];
        // Validate the ACH code passed is actually valid
        if (this.fields.addendaTypeCode.value.length !== 2 || ACHAddendaTypeCodes.includes(this.fields.addendaTypeCode.value) === false) {
            throw new error_js_1.default({
                name: 'ACH Addenda Type Code Error',
                message: `The ACH addenda type code ${this.fields.addendaTypeCode.value} is invalid. Please pass a valid 2-digit addenda type code.`,
            });
        }
        // Validate header field lengths
        validations.validateLengths(this.fields);
        // Validate header data types
        validations.validateDataTypes(this.fields);
    }
    getReturnCode() {
        if (this.fields.paymentRelatedInformation.value || this.fields.paymentRelatedInformation.value.length > 0) {
            return this.fields.paymentRelatedInformation.value.slice(0, 3);
        }
        return false;
    }
    generateString() {
        return (0, utils_js_1.generateString)(this.fields);
    }
    get(field) {
        if (this.debug)
            console.log(`[EntryAddenda:get('${field}')]`, { value: this.fields[field]['value'], field: this.fields[field] });
        return this.fields[field]['value'];
    }
    set(field, value) {
        if (this.fields[field]) {
            if (field === 'entryDetailSequenceNumber') {
                this.fields.entryDetailSequenceNumber['value'] = value.toString().slice(0 - this.fields[field].width); // pass last n digits
            }
            else {
                this.fields[field]['value'] = value;
            }
        }
    }
}
exports.default = EntryAddenda;
module.exports = EntryAddenda;
