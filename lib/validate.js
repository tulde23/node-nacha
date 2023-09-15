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
            Object.keys(object).forEach((k) => {
                const field = object[k];
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
            if (typeof routing === 'number')
                routing = routing.toString();
            // Make sure the routing number is exactly 9-digits long
            if (routing.length !== 9) {
                throw new error_js_1.default({
                    name: 'Invalid ABA Number Length',
                    message: `The ABA routing number ${routing} is ${routing.length}-digits long, but it should be 9-digits long.`
                });
            }
            // Split the routing number into an array of numbers. `array` will look like this: `[2,8,1,0,8,1,4,7,9]`.
            const array = routing.split('').map(Number);
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
            Object.keys(object).forEach((k) => {
                const field = object[k];
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
            Object.keys(object).forEach((k) => {
                const field = object[k];
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
module.exports = validations;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdmFsaWRhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFPQSwwREFBbUM7QUFHbkMseUNBQXVDO0FBRXZDLE1BQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQztBQUNoQyxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUM7QUFDakMsNkRBQTZEO0FBQzdELDZDQUE2QztBQUM3QyxNQUFNLGlCQUFpQixHQUFHLDREQUE0RCxDQUFDO0FBRXZGLFNBQXdCLFdBQVcsQ0FBQyxlQUE4QztJQUNoRixNQUFNLEtBQUssR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDO0lBRXBDLE9BQU87UUFDTCxzQkFBc0IsRUFBRSxDQUFDLE1BQTBGLEVBQUUsRUFBRTtZQUNySCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNoQyxNQUFNLEtBQUssR0FBSSxNQUE2QixDQUFDLENBQTZCLENBQUMsQ0FBQztnQkFDNUUsb0ZBQW9GO2dCQUNwRix1RkFBdUY7Z0JBQ3ZGLElBQ0ksQ0FBQyxVQUFVLElBQUksS0FBSyxJQUFJLE9BQU8sS0FBSyxDQUFDLFFBQVEsS0FBSyxTQUFTLElBQUksS0FBSyxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUM7dUJBQ3BGLENBQUMsQ0FBQyxPQUFPLElBQUksS0FBSyxLQUFLLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsRUFDdkc7b0JBQ0YsSUFBSSxLQUFLLEVBQUM7d0JBQ1IsT0FBTyxDQUFDLEtBQUssQ0FBQywwQ0FBMEMsRUFBRTs0QkFDeEQsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJOzRCQUNoQixLQUFLLEVBQUUsS0FBSyxDQUFDLEtB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