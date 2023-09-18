"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const overrides_js_1 = require("../overrides.js");
const utils_js_1 = require("../utils.js");
const validate_js_1 = __importDefault(require("../validate.js"));
const fields_js_1 = require("./fields.js");
class EntryAddenda {
    /**
     * @param {EntryAddendaOptions} options
     * @param {boolean} autoValidate - optional / defaults to true
     * @param {boolean} debug - optional / defaults to false
     */
    constructor(options, autoValidate = true, debug = false) {
        this.overrides = overrides_js_1.highLevelAddendaFieldOverrides;
        this.debug = debug;
        if (options.fields) {
            this.fields = { ...fields_js_1.fields, ...options.fields };
        }
        else {
            this.fields = { ...fields_js_1.fields };
        }
        this.overrides.forEach((field) => {
            if (options[field])
                this.set(field, options[field]);
        });
        // Some values need special coercing, so after they've been set by overrideLowLevel() we override them
        if (options.returnCode) {
            // console.info('[Addenda constructor]', { returnCode: options.returnCode })
            this.fields.returnCode.value = options.returnCode.slice(0, this.fields.returnCode.width);
        }
        if (options.paymentRelatedInformation) {
            // console.info('[Addenda constructor]', { paymentRelatedInformation: options.paymentRelatedInformation })
            this.fields.paymentRelatedInformation.value = options.paymentRelatedInformation.slice(0, this.fields.paymentRelatedInformation.width);
        }
        if (options.addendaSequenceNumber) {
            // console.info('[Addenda constructor]', { addendaSequenceNumber: options.addendaSequenceNumber })
            this.fields.addendaSequenceNumber.value = options.addendaSequenceNumber;
        }
        if (options.entryDetailSequenceNumber) {
            // console.info('[Addenda constructor]', { entryDetailSequenceNumber: options.entryDetailSequenceNumber })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50cnlBZGRlbmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VudHJ5LWFkZGVuZGEvRW50cnlBZGRlbmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esa0RBQWlFO0FBQ2pFLDBDQUE2QztBQUM3QyxpRUFBeUM7QUFFekMsMkNBQTZEO0FBRTdELE1BQXFCLFlBQVk7SUFLL0I7Ozs7T0FJRztJQUNILFlBQVksT0FBNEIsRUFBRSxlQUF3QixJQUFJLEVBQUUsUUFBaUIsS0FBSztRQVR2RixjQUFTLEdBQUcsNkNBQThCLENBQUM7UUFVaEQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFFbkIsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLGtCQUFvQixFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQzlEO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBRyxrQkFBb0IsRUFBd0IsQ0FBQztTQUNqRTtRQUVELElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDL0IsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQThDLENBQUMsQ0FBQztRQUNuRyxDQUFDLENBQUMsQ0FBQztRQUVILHNHQUFzRztRQUN0RyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDdEIsNEVBQTRFO1lBQzVFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFnQixDQUFDO1NBQ3pHO1FBRUQsSUFBSSxPQUFPLENBQUMseUJB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