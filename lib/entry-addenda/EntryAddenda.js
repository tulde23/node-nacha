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
    /**
     * @param {EntryAddendaOptions} options
     * @param {boolean} autoValidate - optional / defaults to true
     * @param {boolean} debug - optional / defaults to false
     */
    constructor(options, autoValidate = true, debug = false) {
        super({ options, name: 'EntryAddenda', debug });
        this.overrides = overrides_js_1.highLevelAddendaFieldOverrides;
        this.fields = options.fields
            ? (Object.assign(Object.assign({}, options.fields), fields_js_1.fields))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50cnlBZGRlbmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VudHJ5LWFkZGVuZGEvRW50cnlBZGRlbmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EseUVBQStDO0FBQy9DLGtEQUFpRTtBQUNqRSwwQ0FBNkM7QUFDN0MsaUVBQXlDO0FBRXpDLDJDQUFxQztBQUVyQyxNQUFxQixZQUFhLFNBQVEsc0JBQTBCO0lBR2xFOzs7O09BSUc7SUFDSCxZQUFZLE9BQTRCLEVBQUUsZUFBd0IsSUFBSSxFQUFFLFFBQWlCLEtBQUs7UUFDNUYsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUVoRCxJQUFJLENBQUMsU0FBUyxHQUFHLDZDQUE4QixDQUFDO1FBQ2hELElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU07WUFDMUIsQ0FBQyxDQUFDLENBQUMsZ0NBQUssT0FBTyxDQUFDLE1BQU0sR0FBSyxrQkFBTSxDQUErQixDQUFDO1lBQ2pFLENBQUMsQ0FBRSxrQkFBNkIsQ0FBQztRQUVuQyxNQUFNLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQztRQUV2QyxJQUFJLFFBQVEsSUFBSSxJQUFJO2VBQ2pCLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO2VBQ3hCLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxTQUFTLENBQUM7ZUFDN0MsVUFBVSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxFQUFDO1lBQzNDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDMUIsSUFBSSxLQUFLLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxTQUFTO29CQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQThDLENBQUMsQ0FB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