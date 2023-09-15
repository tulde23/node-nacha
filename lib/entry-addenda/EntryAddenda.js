"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const achParser_js_1 = __importDefault(require("../class/achParser.js"));
const overrides_js_1 = require("../overrides.js");
const utils_js_1 = require("../utils.js");
const validate_js_1 = __importDefault(require("../validate.js"));
const fields_js_1 = require("./fields.js");
class EntryAddenda extends achParser_js_1.default {
    constructor(options, autoValidate = true, debug = false) {
        super({ options, name: 'EntryAddenda', debug });
        this.overrides = overrides_js_1.highLevelAddendaFieldOverrides;
        this.fields = options.fields
            ? Object.assign(Object.assign({}, options.fields), fields_js_1.fields)
            : fields_js_1.fields;
        const { overrides, typeGuards } = this;
        if ('fields' in this
            && Array.isArray(overrides)
            && typeGuards.isEntryAddendaOverrides(overrides)
            && typeGuards.isEntryAddendaOptions(options)) {
            overrides.forEach((field) => {
                if (field in options && options[field] !== undefined)
                    this.set(field, options[field]);
            });
        }
        else {
            if (this.debug) {
                console.debug('[overrideOptions::Failed Because]', {
                    fieldsInThis: 'fields' in this,
                    overridesIsArray: Array.isArray(overrides),
                    isEntryAddendaOverrides: typeGuards.isEntryAddendaOverrides(overrides),
                    isEntryAddendaOptions: typeGuards.isEntryAddendaOptions(options),
                });
            }
        }
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
        const { validateRequiredFields, validateLengths, validateDataTypes, validateACHAddendaTypeCode } = (0, validate_js_1.default)(this);
        // Validate required fields
        validateRequiredFields(this.fields);
        // Validate the ACH code passed is actually valid
        validateACHAddendaTypeCode(this.fields.addendaTypeCode.value);
        // Validate header field lengths
        validateLengths(this.fields);
        // Validate header data types
        validateDataTypes(this.fields);
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
