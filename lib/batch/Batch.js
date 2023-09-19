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
            ? { ...header_js_1.BatchHeaderDefaults, ...options.header }
            : { ...header_js_1.BatchHeaderDefaults };
        this.control = options.control
            ? { ...control_js_1.BatchControlDefaults, ...options.control }
            : { ...control_js_1.BatchControlDefaults };
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
        const [headerString, entriesString, controlString] = await Promise.all([
            this.generateHeader(),
            this.generateEntries(),
            this.generateControl()
        ]);
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
            if (this.debug)
                console.log(`[Batch:get('${field}')]`, { value: this.header[field]['value'], field: this.header[field] });
            return this.header[field]['value'];
        }
        // If the control has the field, return the value
        if (field in this.control && this.isAControlField(field)) {
            if (this.debug)
                console.log(`[Batch:get('${field}')]`, { value: this.control[field]['value'], field: this.control[field] });
            return this.control[field]['value'];
        }
        throw new Error(`Field ${field} not found in Batch header or control.`);
    }
    set(field, value) {
        // If the header has the field, set the value
        if (field in this.header && this.isAHeaderField(field)) {
            if (this.debug)
                console.log(`[Batch:set('${field}')]`, { value, field: this.header[field] });
            if (field === 'serviceClassCode') {
                this.header.serviceClassCode.value = value;
            }
            else {
                this.header[field]['value'] = value;
            }
        }
        // If the control has the field, set the value
        if (field in this.control && this.isAControlField(field)) {
            if (this.debug)
                console.log(`[Batch:set('${field}')]`, { value, field: this.control[field] });
            this.control[field]['value'] = value;
        }
    }
}
exports.default = Batch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmF0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvYmF0Y2gvQmF0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxrREFBc0Y7QUFDdEYsMENBQWlHO0FBQ2pHLGlFQUF5QztBQUV6Qyw2Q0FBb0Q7QUFDcEQsMkNBQWtEO0FBRWxELE1BQXFCLEtBQUs7SUFTeEIsWUFBWSxPQUFxQixFQUFFLFlBQVksR0FBRyxJQUFJLEVBQUUsS0FBSyxHQUFHLEtBQUs7UUFKckUsYUFBUSxHQUFpQixFQUFFLENBQUM7UUFLMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFFdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLE1BQU0sRUFBRSx1Q0FBd0IsRUFBRSxPQUFPLEVBQUUsd0NBQXlCLEVBQUUsQ0FBQztRQUUxRixxRUFBcUU7UUFDckUsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTTtZQUMxQixDQUFDLENBQUMsRUFBRSxHQUFHLCtCQUFtQixFQUFFLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUMvQyxDQUFDLENBQUMsRUFBRSxHQUFHLCtCQUFtQixFQUFFLENBQUM7UUFFL0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTztZQUM1QixDQUFDLENBQUMsRUFBRSxHQUFHLGlDQUFvQixFQUFFLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRTtZQUNqRCxDQUFDLENBQUMsRUFBRSxHQUFHLGlDQUFvQixFQUFFLENBQUM7UUFFaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDdEMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQztnQkFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFD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