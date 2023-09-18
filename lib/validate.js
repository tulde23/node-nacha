"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_js_1 = __importDefault(require("./error.js"));
const utils_js_1 = require("./utils.js");
const numericRegex = /^[0-9]+$/;
const alphaRegex = /^[a-zA-Z]+$/;
// Solves -> https://github.com/wilix-team/node-nach/issues/4
// eslint-disable-next-line no-useless-escape
const alphanumericRegex = /(^[0-9a-zA-Z!"#$%&'()*+,-.\/:;<>=?@\[\]\\^_`{}|~ ]+$)|(^$)/;
function validations(classDefinition) {
    const debug = classDefinition.debug;
    return {
        validateRequiredFields: (object) => {
            Object.values(object).forEach((field) => {
                // This check ensures a required field's value is not NaN, null, undefined or empty.
                // Zero is valid, but the data type check will make sure any fields with 0 are numeric.
                if (('required' in field && typeof field.required === 'boolean' && field.required === true)
                    && (('value' in field === false) || (field.value === undefined) || field.value.toString().length === 0)) {
                    if (debug) {
                        console.debug('[validateRequiredFields::Failed Because]', {
                            name: field.name,
                            value: field.value,
                            required: field.required,
                            length: field.value.toString().length,
                        });
                    }
                    throw new error_js_1.default({
                        name: 'Required Field Blank',
                        message: `${field.name} is a required field but its value is: ${field.value}`
                    });
                }
            });
            return true;
        },
        validateRoutingNumber: (routing) => {
            const tempRouting = `${routing}`;
            // Make sure the routing number is exactly 9-digits long
            if (tempRouting.length !== 9) {
                throw new error_js_1.default({
                    name: 'Invalid ABA Number Length',
                    message: `The ABA routing number ${routing} is ${tempRouting.length}-digits long, but it should be 9-digits long.`
                });
            }
            // Split the routing number into an array of numbers. `array` will look like this: `[2,8,1,0,8,1,4,7,9]`.
            const array = tempRouting.split('').map(Number);
            // Validate the routing number (ABA). See here for more info: http://www.brainjar.com/js/validation/
            const sum = 3 * (array[0] + array[3] + array[6]) +
                7 * (array[1] + array[4] + array[7]) +
                1 * (array[2] + array[5] + array[8]);
            // Throw an error if the the result of `sum` modulo 10 is not zero. The value of `sum` must be a multiple of 10 to be a valid routing number.
            if (sum % 10 !== 0) {
                throw new error_js_1.default({
                    name: 'Invalid ABA Number',
                    message: `The ABA routing number ${routing} is invalid. Please ensure a valid 9-digit ABA routing number is passed.`,
                });
            }
            return true;
        },
        validateLengths: (object) => {
            Object.values(object).forEach((field) => {
                if (field.value.toString().length > field.width) {
                    throw new error_js_1.default({
                        name: 'Invalid Length',
                        message: `${field.name}'s length is ${(typeof field.value === 'number') ? field.value.toString().length : field.value.length}, but it should be no greater than ${field.width}.`
                    });
                }
            });
            return true;
        },
        validateDataTypes: (object) => {
            Object.values(object).forEach((field) => {
                if (('blank' in field) === false || ('blank' in field && field.blank === false)) {
                    switch (field.type) {
                        case 'numeric': {
                            (0, utils_js_1.testRegex)(numericRegex, field);
                            break;
                        }
                        case 'alpha': {
                            (0, utils_js_1.testRegex)(alphaRegex, field);
                            break;
                        }
                        case 'alphanumeric': {
                            (0, utils_js_1.testRegex)(alphanumericRegex, field);
                            break;
                        }
                        case 'ABA': {
                            break;
                        }
                        default: {
                            throw new error_js_1.default({
                                name: 'Invalid Data Type',
                                message: `${field.name}'s data type is required to be ${field.type}, but its contents don't reflect that.`
                            });
                        }
                    }
                }
            });
            return true;
        },
        validateACHCode: (transactionCode) => {
            const ACHTransactionCodes = ['22', '23', '24', '27', '28', '29', '32', '33', '34', '37', '38', '39'];
            if (transactionCode.length !== 2 || ACHTransactionCodes.includes(transactionCode) === false) {
                if (debug) {
                    console.debug('[validateACHCode::Failed Because]', {
                        transactionCode,
                        ACHTransactionCodes,
                        includes: ACHTransactionCodes.includes(transactionCode),
                    });
                }
                throw new error_js_1.default({
                    name: 'ACH Transaction Code Error',
                    message: 'The ACH transaction code ' + transactionCode + ' is invalid. Please pass a valid 2-digit transaction code.'
                });
            }
            return true;
        },
        validateACHAddendaTypeCode: (addendaTypeCode) => {
            const ACHAddendaTypeCodes = ['02', '05', '98', '99'];
            if (addendaTypeCode.length !== 2 || ACHAddendaTypeCodes.includes(addendaTypeCode) === false) {
                throw new error_js_1.default({
                    name: 'ACH Addenda Type Code Error',
                    message: 'The ACH addenda type code ' + addendaTypeCode + ' is invalid. Please pass a valid 2-digit addenda type code.'
                });
            }
            return true;
        },
        validateACHServiceClassCode: (serviceClassCode) => {
            const ACHServiceClassCodes = ['200', '220', '225'];
            if (serviceClassCode.length !== 3 || ACHServiceClassCodes.includes(serviceClassCode) === false) {
                throw new error_js_1.default({
                    name: 'ACH Service Class Code Error',
                    message: 'The ACH service class code ' + serviceClassCode + ' is invalid. Please pass a valid 3-digit service class code.'
                });
            }
            return true;
        },
        getNextMultipleDiff: (value, multiple) => {
            return (value + (multiple - value % multiple)) - value;
        }
    };
}
exports.default = validations;
// Insure a given transaction code is valid
// export function validateACHAddendaCode(transactionCode: NumericalString) {
// if (transactionCode.length !== 2 || !_.includes(ACHTransactionCodes, transactionCode)) {
//   throw new nACHError({
//     name: 'ACH Transaction Code Error',
//     message: 'The ACH transaction code ' + transactionCode + ' is invalid for addenda records. Please pass a valid 2-digit transaction code.'
//   });
// }
//   return true;
// } //? WTF is this function for?
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdmFsaWRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFPQSwwREFBbUM7QUFHbkMseUNBQXVDO0FBRXZDLE1BQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQztBQUNoQyxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUM7QUFDakMsNkRBQTZEO0FBQzdELDZDQUE2QztBQUM3QyxNQUFNLGlCQUFpQixHQUFHLDREQUE0RCxDQUFDO0FBRXZGLFNBQXdCLFdBQVcsQ0FBQyxlQUE4QztJQUNoRixNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDO0lBRXBDLE9BQU87UUFDTCxzQkFBc0IsRUFBRSxDQUFDLE1BQTBGLEVBQUUsRUFBRTtZQUNySCxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUN0QyxvRkFBb0Y7Z0JBQ3BGLHVGQUF1RjtnQkFDdkYsSUFDSSxDQUFDLFVBQVUsSUFBSSxLQUFLLElBQUksT0FBTyxLQUFLLENBQUMsUUFBUSxLQUFLLFNBQVMsSUFBSSxLQUFLLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQzt1QkFDcEYsQ0FBQyxDQUFDLE9BQU8sSUFBSSxLQUFLLEtBQUssS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxFQUN2RztvQkFDRixJQUFJLEtBQUssRUFBQzt3QkFDUixPQUFPLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxFQUFFOzRCQUN4RCxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7NEJBQ2hCLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSzs0QkFDbEIsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFROzRCQUN4QixNQUFNLEVB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