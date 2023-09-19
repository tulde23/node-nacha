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
        this.debug = debug;
        if (options.fields) {
            this.fields = { ...JSON.parse(JSON.stringify(fields_js_1.AddendaFieldDefaults)), ...options.fields };
        }
        else {
            this.fields = JSON.parse(JSON.stringify(fields_js_1.AddendaFieldDefaults));
        }
        overrides_js_1.highLevelAddendaFieldOverrides.forEach((field) => {
            const overrideValue = options[field];
            if (overrideValue)
                this.set(field, overrideValue);
        });
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
            if (this.debug)
                console.log(`[EntryAddenda:set('${field}')]`, { value, field: this.fields[field] });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50cnlBZGRlbmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2VudHJ5LWFkZGVuZGEvRW50cnlBZGRlbmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esa0RBQWlFO0FBQ2pFLDBDQUE2QztBQUM3QyxpRUFBeUM7QUFFekMsMkNBQW1EO0FBRW5ELE1BQXFCLFlBQVk7SUFJL0I7Ozs7T0FJRztJQUNILFlBQVksT0FBNEIsRUFBRSxlQUF3QixJQUFJLEVBQUUsUUFBaUIsS0FBSztRQUM1RixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDbEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGdDQUFvQixDQUFDLENBQWlDLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUF3QixDQUFDO1NBQy9JO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQ0FBb0IsQ0FBQyxDQUFpQyxDQUFDO1NBQ2hHO1FBRUQsNkNBQThCLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDL0MsTUFBTSxhQUFhLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JDLElBQUksYUFBYTtnQkFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILHNHQUFzRztRQUN0RyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVB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