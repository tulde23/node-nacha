"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_js_1 = require("../utils.js");
const validate_js_1 = require("../validate.js");
const achParser_js_1 = __importDefault(require("./achParser.js"));
class EntryAddenda extends achParser_js_1.default {
    constructor(options, autoValidate = true) {
        super({ options, name: 'EntryAddenda' });
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
            this.fields.entryDetailSequenceNumber.value = Number(options.entryDetailSequenceNumber.toString().slice(0 - this.fields.entryDetailSequenceNumber.width)); // last n digits. pass 
        }
        // Validate required fields have been passed
        if (autoValidate)
            this.validate();
    }
    validate() {
        // Validate required fields
        (0, validate_js_1.validateRequiredFields)(this.fields);
        // Validate the ACH code passed is actually valid
        (0, validate_js_1.validateACHAddendaTypeCode)(this.fields.addendaTypeCode.value);
        // Validate header field lengths
        (0, validate_js_1.validateLengths)(this.fields);
        // Validate header data types
        (0, validate_js_1.validateDataTypes)(this.fields);
    }
    getReturnCode() {
        if (this.fields.paymentRelatedInformation.value || this.fields.paymentRelatedInformation.value.length > 0) {
            return this.fields.paymentRelatedInformation.value.slice(0, 3);
        }
        return false;
    }
    generateString() {
        let result = '';
        Object.keys(this.fields).forEach((key) => {
            var _a;
            const field = this.fields[key];
            if (!field.position)
                return;
            if (('blank' in field && field.blank === true) || field.type === 'alphanumeric') {
                result += (0, utils_js_1.pad)(field.value, field.width);
                return;
            }
            const string = ('number' in field && field.number === true)
                ? Number(field.value).toFixed(2)
                : field.value;
            const paddingChar = (_a = field.paddingChar) !== null && _a !== void 0 ? _a : '0';
            result += (0, utils_js_1.pad)(string, field.width, false, paddingChar);
        });
        return result;
    }
    get(field) {
        return this.fields[field]['value'];
    }
}
exports.default = EntryAddenda;
module.exports = EntryAddenda;
