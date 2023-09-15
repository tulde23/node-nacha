"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const achParser_js_1 = __importDefault(require("../class/achParser.js"));
const overrides_js_1 = require("../overrides.js");
const utils_js_1 = require("../utils.js");
const validate_js_1 = __importDefault(require("../validate.js"));
const fields_js_1 = require("./fields.js");
/**
 * @class Entry
 */
class Entry extends achParser_js_1.default {
    /**
     * @param {EntryOptions} options - required
     * @param {boolean} autoValidate - optional / defaults to true
     * @param {boolean} debug - optional / defaults to false
     * @returns {Entry}
     */
    constructor(options, autoValidate = true, debug = false) {
        super({ options: options, name: 'Entry', debug });
        this._addendas = [];
        this.overrides = overrides_js_1.highLevelFieldOverrides;
        this.fields = options.fields
            ? Object.assign(Object.assign({}, options.fields), fields_js_1.fields) : fields_js_1.fields;
        const { typeGuards, overrides } = this;
        if ('fields' in this
            && Array.isArray(overrides)
            && typeGuards.isEntryOverrides(overrides)
            && typeGuards.isEntryOptions(this.options)) {
            overrides.forEach((field) => {
                if (field in this.options) {
                    const value = this.options[field];
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
        }
        else {
            if (this.debug) {
                console.debug('[overrideOptions::Failed Because]', {
                    fieldsInThis: 'fields' in this,
                    overridesIsArray: Array.isArray(overrides),
                    isEntryOverrides: typeGuards.isEntryOverrides(overrides),
                    isEntryOptions: typeGuards.isEntryOptions(options),
                });
            }
        }
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
        // Add indicator to Entry record
        this.set('addendaId', '1');
        // Set corresponding fields on Addenda
        entryAddenda.set('addendaSequenceNumber', this._addendas.length + 1);
        entryAddenda.set('entryDetailSequenceNumber', traceNumber);
        // Add the new entryAddenda to the addendas array
        this._addendas.push(entryAddenda);
    }
    getAddendas() { return this._addendas; }
    getRecordCount() { return this._addendas.length + 1; }
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
    generateString() {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const result = [yield (0, utils_js_1.generateString)(this.fields)];
            try {
                for (var _d = true, _e = __asyncValues(this._addendas), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    const addenda = _c;
                    result.push(yield addenda.generateString());
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return result.join('\r\n');
        });
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
module.exports = Entry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW50cnkvRW50cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EseUVBQStDO0FBRS9DLGtEQUEwRDtBQUMxRCwwQ0FBb0Y7QUFDcEYsaUVBQXlDO0FBRXpDLDJDQUFxQztBQUVyQzs7R0FFRztBQUNILE1BQXFCLEtBQU0sU0FBUSxzQkFBbUI7SUFJcEQ7Ozs7O09BS0c7SUFDSCxZQUFZLE9BQXFCLEVBQUUsZUFBd0IsSUFBSSxFQUFFLFFBQWlCLEtBQUs7UUFDckYsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFUcEQsY0FBUyxHQUF3QixFQUFFLENBQUM7UUFXbEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxzQ0FBdUIsQ0FBQztRQUN6QyxJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNO1lBQzFCLENBQUMsaUNBQU0sT0FBTyxDQUFDLE1BQU0sR0FBSyxrQkFBTSxFQUNoQyxDQUFDLENBQUMsa0JBQU0sQ0FBQztRQUVYLE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBRXZDLElBQUksUUFBUSxJQUFJLElBQUk7ZUFDZixLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztlQUN4QixVQUFVLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDO2VBQ3RDLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDO1lBQ3pDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDMUIsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBQztvQkFDeEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztv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