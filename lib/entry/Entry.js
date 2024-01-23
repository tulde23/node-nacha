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
        this.addendas = [];
        this.debug = debug;
        if (options.fields) {
            this.fields = (0, utils_js_1.deepMerge)(fields_js_1.EntryFieldDefaults, options.fields);
        }
        else {
            this.fields = (0, utils_js_1.deepMerge)({}, fields_js_1.EntryFieldDefaults);
        }
        overrides_js_1.highLevelFieldOverrides.forEach((field) => {
            if (field in options) {
                const value = options[field];
                if (value) {
                    if (field === "transactionCode" ||
                        field === "receivingDFI" ||
                        field === "traceNumber" ||
                        field === "checkDigit" ||
                        field === "DFIAccount" ||
                        field === "idNumber" ||
                        field === "discretionaryData") {
                        this.set(field, value);
                    }
                    else if (field === "amount") {
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
        const traceNumber = this.get("traceNumber");
        // Add indicator to Entry record
        this.fields.addendaId.value = "1";
        // Set corresponding fields on Addenda
        entryAddenda.set("addendaSequenceNumber", this.addendas.length + 1);
        entryAddenda.set("entryDetailSequenceNumber", traceNumber);
        // Add the new entryAddenda to the addendas array
        this.addendas.push(entryAddenda);
    }
    getAddendas() {
        return this.addendas;
    }
    getRecordCount() {
        return this.addendas.length + 1;
    }
    _validate() {
        try {
            const { validateDataTypes, validateLengths, validateRequiredFields, validateRoutingNumber, validateACHCode, } = (0, validate_js_1.default)(this);
            // Validate required fields
            validateRequiredFields(this.fields);
            // Validate the ACH code passed
            if (this.fields.addendaId.value == "0") {
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
                console.debug("[Entry::_validate::Error]", error);
            throw error;
        }
    }
    async generateString() {
        const result = [await (0, utils_js_1.generateString)(this.fields)];
        for await (const addenda of this.addendas) {
            result.push(await addenda.generateString());
        }
        return result.join("\r\n") + "\r\n";
    }
    get(field) {
        return this.fields[field]["value"];
    }
    set(field, value) {
        if (this.fields[field])
            this.fields[field]["value"] = value;
    }
}
exports.default = Entry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZW50cnkvRW50cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFFQSxrREFBMEQ7QUFDMUQsMENBS3FCO0FBQ3JCLGlFQUF5QztBQUV6QywyQ0FBaUQ7QUFFakQ7Ozs7OztHQU1HO0FBQ0gsTUFBcUIsS0FBSztJQU14Qjs7Ozs7T0FLRztJQUNILFlBQ0UsT0FBcUIsRUFDckIsZUFBd0IsSUFBSSxFQUM1QixRQUFpQixLQUFLO1FBWGpCLGFBQVEsR0FBd0IsRUFBRSxDQUFDO1FBYXhDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBRW5CLElBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtZQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUEsb0JBQVMsRUFDckIsOEJBQWtCLEVBQ2xCLE9BQU8sQ0FBQyxNQUFNLENBQ0EsQ0FBQztTQUNsQjthQUFNO1lBQ0wsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxFQUFFLDhCQUFrQixDQUFnQixDQUFDO1NBQ2hFO1FBRUQsc0NBQXVCLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDeEMsSUFBSSxLQUFLLElBQUksT0FBTyxFQUFFO2dCQUNwQixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRTdCLElBQUksS0FBSyxFQUFFO29CQUNULElBQ0UsS0FBSyxLQUFLLGlCQUFpQjt3QkFDM0IsS0FBSyxLQUFLLGNBQWM7d0JBQ3hCLEtBQUssS0FBSyxhQUFhO3dCQUN2QixLQUFLLEtBQUssWUFBWTt3QkFDdEIsS0FBSyxLQUFLLFlBQVk7d0JBQ3RCLEtBQUssS0FBSyxVQUFVO3dCQUNwQixLQUFLLEtBQUssbUJBQW1CLEVBQzdCO3dCQUNBLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQW9CLENBQUMsQ0FBQztxQkFDdkM7eUJB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