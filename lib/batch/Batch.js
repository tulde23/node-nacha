"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const achParser_js_1 = __importDefault(require("../class/achParser.js"));
const error_js_1 = __importDefault(require("../error.js"));
const utils_js_1 = require("../utils.js");
class Batch extends achParser_js_1.default {
    constructor(options, autoValidate = true, debug = false) {
        super({ options, name: 'Batch', debug });
        this._entries = [];
        if (autoValidate) {
            // Validate the routing number (ABA) before slicing
            validateRoutingNumber((0, utils_js_1.computeCheckDigit)(options.originatingDFI));
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
        const { validations } = this;
        // Validate required fields have been passed
        validations.validateRequiredFields(this.header);
        const ACHServiceClassCodes = ['200', '220', '225'];
        // Validate the batch's ACH service class code
        if (this.header.serviceClassCode.value.length !== 3 || ACHServiceClassCodes.includes(this.header.serviceClassCode.value) === false) {
            throw new error_js_1.default({
                name: 'ACH Service Class Code Error',
                message: `The ACH service class code ${this.header.serviceClassCode.value} is invalid. Please pass a valid 3-digit service class code.`,
            });
        }
        // Validate field lengths
        validations.validateLengths(this.header);
        // Validate datatypes
        validations.validateDataTypes(this.header);
        // Validate required fields have been passed
        validations.validateRequiredFields(this.control);
        // Validate field lengths
        validations.validateLengths(this.control);
        // Validate datatypes
        validations.validateDataTypes(this.control);
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
                    console.log('Transaction codes did not match or are not supported yet (unsupported status codes include: 23, 24, 28, 29, 33, 34, 38, 39)');
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
    generateEntries() {
        return this._entries.map(entry => entry.generateString()).join('\r\n');
    }
    generateString() {
        const headerString = this.generateHeader();
        const entriesString = this.generateEntries();
        const controlString = this.generateControl();
        return headerString + '\r\n' + entriesString + controlString;
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
