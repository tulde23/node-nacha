"use strict";
// Entry
Object.defineProperty(exports, "__esModule", { value: true });
const utils_js_1 = require("../utils.js");
const overrides_js_1 = require("../overrides.js");
const fields_js_1 = require("./fields.js");
const validate_js_1 = require("../validate.js");
class EntryAddenda {
    constructor(options, autoValidate) {
        // Allow the file header defaults to be override if provided
        this.fields = (options.fields)
            ? Object.assign(Object.assign({}, options.fields), fields_js_1.fields)
            : fields_js_1.fields;
        // Set our high-level values
        (0, utils_js_1.overrideLowLevel)(overrides_js_1.highLevelAddendaFieldOverrides, options, this);
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
        if (autoValidate !== false) {
            // Validate required fields have been passed
            this._validate();
        }
    }
    _validate() {
        // Validate required fields
        (0, validate_js_1.validateRequiredFields)(this.fields);
        // Validate the ACH code passed is actually valid
        (0, validate_js_1.validateACHAddendaTypeCode)(this.fields.addendaTypeCode.value);
        // Validate header field lengths
        (0, validate_js_1.validateLengths)(this.fields);
        // Validate header data types
        (0, validate_js_1.validateDataTypes)(this.fields);
    }
    generateString(cb) {
        (0, utils_js_1.generateString)(this.fields, function (string) {
            cb(string);
        });
    }
    getReturnCode() {
        if (this.fields.paymentRelatedInformation.value || this.fields.paymentRelatedInformation.value.length > 0) {
            return this.fields.paymentRelatedInformation.value.slice(0, 3);
        }
        return false;
    }
    get(field) {
        return this.fields[field]['value'];
    }
    set(field, value) {
        if (this.fields[field]) {
            if (field === 'entryDetailSequenceNumber') {
                this.fields.entryDetailSequenceNumber['value'] = Number(value.toString().slice(0 - this.fields[field].width)); // pass last n digits
            }
            else {
                this.fields[field]['value'] = value;
            }
        }
    }
}
exports.default = EntryAddenda;
module.exports = EntryAddenda;
