"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const overrides_js_1 = require("../overrides.js");
const utils_js_1 = require("../utils.js");
const validate_js_1 = __importDefault(require("../validate.js"));
const control_js_1 = require("./control.js");
const header_js_1 = require("./header.js");
class Batch {
    constructor(options, autoValidate = true, debug = false) {
        this._entries = [];
        this.debug = debug;
        this.options = options;
        this.overrides = { header: overrides_js_1.highLevelHeaderOverrides, control: overrides_js_1.highLevelControlOverrides };
        // Allow the batch header/control defaults to be override if provided
        this.header = options.header
            ? { ...options.header, ...header_js_1.header }
            : { ...header_js_1.header };
        this.control = options.control
            ? { ...options.control, ...control_js_1.control }
            : { ...control_js_1.control };
        this.overrides.header.forEach((field) => {
            if (this.options[field])
                this.set(field, this.options[field]);
        });
        this.overrides.control.forEach((field) => {
            if (this.options[field])
                this.set(field, this.options[field]);
        });
        if (autoValidate) {
            // Validate the routing number (ABA) before slicing
            (0, validate_js_1.default)(this).validateRoutingNumber((0, utils_js_1.computeCheckDigit)(options.originatingDFI));
        }
        if (options.companyName) {
            this.header.companyName.value = options.companyName.slice(0, this.header.companyName.width);
        }
        if (options.companyEntryDescription) {
            this.header.companyEntryDescription.value = options.companyEntryDescription.slice(0, this.header.companyEntryDescription.width);
        }
        if (options.companyDescriptiveDate) {
            this.header.companyDescriptiveDate.value = options.companyDescriptiveDate.slice(0, this.header.companyDescriptiveDate.width);
        }
        if (options.effectiveEntryDate) {
            if (typeof options.effectiveEntryDate == 'string') {
                options.effectiveEntryDate = (0, utils_js_1.parseYYMMDD)(options.effectiveEntryDate);
            }
            this.header.effectiveEntryDate.value = (0, utils_js_1.formatDateToYYMMDD)(options.effectiveEntryDate);
        }
        if (options.originatingDFI) {
            this.header.originatingDFI.value = (0, utils_js_1.computeCheckDigit)(options.originatingDFI).slice(0, this.header.originatingDFI.width);
        }
        // Set control values which use the same header values
        this.control.serviceClassCode.value = this.header.serviceClassCode.value;
        this.control.companyIdentification.value = this.header.companyIdentification.value;
        this.control.originatingDFI.value = this.header.originatingDFI.value;
        if (autoValidate !== false) {
            // Perform validation on all the passed values
            this._validate();
        }
    }
    _validate() {
        const { validateDataTypes, validateLengths, validateRequiredFields, validateACHServiceClassCode } = (0, validate_js_1.default)(this);
        // Validate required fields have been passed
        validateRequiredFields(this.header);
        // Validate the batch's ACH service class code
        validateACHServiceClassCode(this.header.serviceClassCode.value);
        // Validate field lengths
        validateLengths(this.header);
        // Validate datatypes
        validateDataTypes(this.header);
        // Validate required fields have been passed
        validateRequiredFields(this.control);
        // Validate field lengths
        validateLengths(this.control);
        // Validate datatypes
        validateDataTypes(this.control);
    }
    addEntry(entry) {
        // Increment the addendaCount of the batch
        if (typeof this.control.addendaCount.value === 'number')
            this.control.addendaCount.value += entry.getRecordCount();
        // Add the new entry to the entries array
        this._entries.push(entry);
        // Update the batch values like total debit and credit $ amounts
        let entryHash = 0;
        let totalDebit = 0;
        let totalCredit = 0;
        // (22, 23, 24, 27, 28, 29, 32, 33, 34, 37, 38 & 39)
        const creditCodes = ['22', '23', '24', '32', '33', '34'];
        const debitCodes = ['27', '28', '29', '37', '38', '39'];
        this._entries.forEach((entry) => {
            entryHash += Number(entry.fields.receivingDFI.value);
            if (typeof entry.fields.amount.value === 'number') {
                if (creditCodes.includes(entry.fields.transactionCode.value)) {
                    totalCredit += entry.fields.amount.value;
                }
                else if (debitCodes.includes(entry.fields.transactionCode.value)) {
                    totalDebit += entry.fields.amount.value;
                }
                else {
                    console.info('[Batch::addEntry] Unsupported Transaction Code ->', `Transaction code ${entry.fields.transactionCode.value} did not match or are not supported yet (unsupported status codes include: 23, 24, 28, 29, 33, 34, 38, 39)`);
                }
            }
        });
        this.control.totalCredit.value = totalCredit;
        this.control.totalDebit.value = totalDebit;
        // Add up the positions 4-11 and compute the total. Slice the 10 rightmost digits.
        this.control.entryHash.value = Number(entryHash.toString().slice(-10));
    }
    getEntries() { return this._entries; }
    generateHeader() { return (0, utils_js_1.generateString)(this.header); }
    generateControl() { return (0, utils_js_1.generateString)(this.control); }
    async generateEntries() {
        return (await Promise.all(this._entries.map(async (entry) => await entry.generateString()))).join('\r\n');
    }
    async generateString() {
        const headerString = await this.generateHeader();
        const entriesString = await this.generateEntries();
        const controlString = await this.generateControl();
        return `${headerString}\r\n${entriesString}${controlString}`;
    }
    isAHeaderField(field) {
        return Object.keys(this.header).includes(field);
    }
    isAControlField(field) {
        return Object.keys(this.control).includes(field);
    }
    get(field) {
        // If the header has the field, return the value
        if (field in this.header && this.isAHeaderField(field)) {
            return this.header[field]['value'];
        }
        // If the control has the field, return the value
        if (field in this.control && this.isAControlField(field))
            return this.control[field]['value'];
        throw new Error(`Field ${field} not found in Batch header or control.`);
    }
    set(field, value) {
        // If the header has the field, set the value
        if (field in this.header && this.isAHeaderField(field)) {
            if (field === 'serviceClassCode') {
                this.header.serviceClassCode.value = value;
            }
            else {
                this.header[field]['value'] = value;
            }
        }
        // If the control has the field, set the value
        if (field in this.control && this.isAControlField(field)) {
            this.control[field]['value'] = value;
        }
    }
}
exports.default = Batch;
module.exports = Batch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmF0Y2gvQmF0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxrREFBc0Y7QUFDdEYsMENBQWlHO0FBQ2pHLGlFQUF5QztBQUV6Qyw2Q0FBdUM7QUFDdkMsMkNBQXFDO0FBRXJDLE1BQXFCLEtBQUs7SUFTeEIsWUFBWSxPQUFxQixFQUFFLFlBQVksR0FBRyxJQUFJLEVBQUUsS0FBSyxHQUFHLEtBQUs7UUFKckUsYUFBUSxHQUFpQixFQUFFLENBQUM7UUFLMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFFdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLE1BQU0sRUFBRSx1Q0FBd0IsRUFBRSxPQUFPLEVBQUUsd0NBQXlCLEVBQUUsQ0FBQztRQUUxRixxRUFBcUU7UUFDckUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTTtZQUMxQixDQUFDLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxrQkFBTSxFQUFFO1lBQ2xDLENBQUMsQ0FBQyxFQUFFLEdBQUcsa0JBQU0sRUFBRSxDQUFDO1FBRWxCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU87WUFDNUIsQ0FBQyxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsb0JBQU8sRUFBRTtZQUNwQyxDQUFDLENBQUMsRUFBRSxHQUFHLG9CQUFPLEVBQUUsQ0FBQztRQUVuQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUN0QyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO2dCQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsS0FB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