"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const overrides_js_1 = require("../overrides.js");
const utils_js_1 = require("../utils.js");
const validate_js_1 = __importDefault(require("../validate.js"));
const fields_js_1 = require("./fields.js");
/**
 * @class Entry
 * @description Entry class that will be used to create Entry objects
 * @param {EntryOptions} options - required
 * @param {boolean} autoValidate - optional / defaults to true
 * @param {boolean} debug - optional / defaults to false
 */
class Entry {
    /**
     * @param {EntryOptions} options - required
     * @param {boolean} autoValidate - optional / defaults to true
     * @param {boolean} debug - optional / defaults to false
     * @returns {Entry}
     */
    constructor(options, autoValidate = true, debug = false) {
        this.overrides = overrides_js_1.highLevelFieldOverrides;
        this.addendas = [];
        this.debug = debug;
        if (options.fields) {
            this.fields = { ...fields_js_1.fields, ...options.fields };
        }
        else {
            this.fields = { ...fields_js_1.fields };
        }
        this.overrides.forEach((field) => {
            if (field in options) {
                const value = options[field];
                if (value) {
                    if (field === 'transactionCode'
                        || field === 'receivingDFI'
                        || field === 'traceNumber'
                        || field === 'checkDigit'
                        || field === 'DFIAccount'
                        || field === 'idNumber'
                        || field === 'discretionaryData') {
                        this.set(field, value);
                    }
                    else if (field === 'amount') {
                        this.set(field, Number(value));
                    }
                    else {
                        this.set(field, value);
                    }
                }
            }
        });
        // Some values need special coercing, so after they've been set by overrideLowLevel() we override them
        if (options.receivingDFI) {
            this.fields.receivingDFI.value = (0, utils_js_1.computeCheckDigit)(options.receivingDFI).slice(0, -1);
            this.fields.checkDigit.value = (0, utils_js_1.computeCheckDigit)(options.receivingDFI).slice(-1);
        }
        if (options.DFIAccount) {
            this.fields.DFIAccount.value = options.DFIAccount.slice(0, this.fields.DFIAccount.width);
        }
        if (options.amount) {
            this.fields.amount.value = Number(options.amount);
        }
        if (options.idNumber) {
            this.fields.idNumber.value = options.idNumber;
        }
        if (options.individualName) {
            this.fields.individualName.value = options.individualName.slice(0, this.fields.individualName.width);
        }
        if (options.discretionaryData) {
            this.fields.discretionaryData.value = options.discretionaryData;
        }
        if (autoValidate !== false) {
            // Validate required fields have been passed
            this._validate();
        }
    }
    addAddenda(entryAddenda) {
        const traceNumber = this.get('traceNumber');
        console.info('Entry.addAddenda', { traceNumber });
        // Add indicator to Entry record
        this.set('addendaId', '1');
        const addendaSequenceNumber = this.addendas.length + 1;
        // Set corresponding fields on Addenda
        entryAddenda.set('addendaSequenceNumber', addendaSequenceNumber);
        entryAddenda.set('entryDetailSequenceNumber', traceNumber);
        // Add the new entryAddenda to the addendas array
        this.addendas.push(entryAddenda);
        console.info({
            'Adding -> entryAddenda': entryAddenda.fields['paymentRelatedInformation'],
            'Current -> addendas': this.addendas?.map(({ fields: f }) => f['paymentRelatedInformation']),
        });
    }
    getAddendas() { return this.addendas; }
    getRecordCount() { return this.addendas.length + 1; }
    _validate() {
        try {
            const { validateDataTypes, validateLengths, validateRequiredFields, validateRoutingNumber, validateACHCode } = (0, validate_js_1.default)(this);
            // Validate required fields
            validateRequiredFields(this.fields);
            // Validate the ACH code passed
            if (this.fields.addendaId.value == '0') {
                validateACHCode(this.fields.transactionCode.value);
            }
            else {
                if (this.fields.transactionCode.value) {
                    //  validateACHAddendaCode(this.fields.transactionCode.value);
                    //! - this didn't do anything in the base library
                }
            }
            // Validate the routing number
            validateRoutingNumber((0, utils_js_1.addNumericalString)(this.fields.receivingDFI.value, this.fields.checkDigit.value));
            // Validate header field lengths
            validateLengths(this.fields);
            // Validate header data types
            validateDataTypes(this.fields);
        }
        catch (error) {
            if (this.debug)
                console.debug('[Entry::_validate::Error]', error);
            throw error;
        }
    }
    async generateString() {
        const result = [await (0, utils_js_1.generateString)(this.fields)];
        for await (const addenda of this.addendas) {
            // console.log({ addenda: addenda.fields })
            result.push(await addenda.generateString());
        }
        return result.join('\r\n');
    }
    get(field) {
        return this.fields[field]['value'];
    }
    set(field, value) {
        if (this.fields[field])
            this.fields[field]['value'] = value;
    }
}
exports.default = Entry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW50cnkvRW50cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxrREFBMEQ7QUFDMUQsMENBQW9GO0FBQ3BGLGlFQUF5QztBQUV6QywyQ0FBc0Q7QUFFdEQ7Ozs7OztHQU1HO0FBQ0gsTUFBcUIsS0FBSztJQU94Qjs7Ozs7T0FLRztJQUNILFlBQVksT0FBcUIsRUFBRSxlQUF3QixJQUFJLEVBQUUsUUFBaUIsS0FBSztRQVpoRixjQUFTLEdBQUcsc0NBQXVCLENBQUM7UUFJcEMsYUFBUSxHQUF3QixFQUFFLENBQUM7UUFTeEMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFFbkIsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFDO1lBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLGtCQUFhLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDdkQ7YUFBTTtZQUNMLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxHQUFHLGtCQUFhLEVBQWlCLENBQUM7U0FDbkQ7UUFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQy9CLElBQUksS0FBSyxJQUFJLE9BQU8sRUFBQztnQkFDbkIsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUU3QixJQUFJLEtBQUssRUFBRTtvQkFDVCxJQUFJLEtBQUssS0FBSyxpQkFBaUI7MkJBQzVCLEtBQUssS0FBSyxjQUFjOzJCQUN4QixLQUFLLEtBQUssYUFBYTsyQkFDdkIsS0FBSyxLQUFLLFlBQVk7MkJBQ3RCLEtBQUssS0FBSyxZQUFZOzJCQUN0QixLQUFLLEtBQUssVUFBVTsyQkFDcEIsS0FBSyxLQUFLLG1CQUFtQixFQUFFO3dCQUNoQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFvQixDQUFDLENB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