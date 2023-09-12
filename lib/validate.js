"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRoutingNumber = exports.validateACHCode = exports.validateACHAddendaTypeCode = exports.validateDataTypes = exports.getNextMultipleDiff = exports.validateLengths = exports.validateRequiredFields = void 0;
//TODO: Maybe validate position with indexes
const utils_1 = require("./utils");
const error_1 = __importDefault(require("./error"));
const ACHAddendaTypeCodes = ['02', '05', '98', '99'];
const ACHTransactionCodes = ['22', '23', '24', '27', '28', '29', '32', '33', '34', '37', '38', '39'];
const numericRegex = /^[0-9]+$/;
const alphaRegex = /^[a-zA-Z]+$/;
// eslint-disable-next-line no-useless-escape
const alphanumericRegex = /(^[0-9a-zA-Z!"#$%&'()*+,-.\/:;<>=?@\[\]\\^_`{}|~ ]+$)|(^$)/;
// Validate required fields to make sure they have values
function validateRequiredFields(object) {
    Object.keys(object).forEach((k) => {
        const field = object[k];
        // This check ensures a required field's value is not NaN, null, undefined or empty.
        // Zero is valid, but the data type check will make sure any fields with 0 are numeric.
        if (('required' in field && typeof field.required === 'boolean' && field.required === true)
            && (('value' in field === false) || (!field.value) || field.value.toString().length === 0)) {
            console.error('[nACH Error]', { field });
            throw new error_1.default({
                name: 'Required Field Blank',
                message: `${field.name} is a required field but its value is: ${field.value}`
            });
        }
    });
    return true;
}
exports.validateRequiredFields = validateRequiredFields;
// Validate the lengths of fields by using their `width` property
function validateLengths(object) {
    Object.keys(object).forEach((k) => {
        const field = object[k];
        if (field.value.toString().length > field.width) {
            throw new error_1.default({
                name: 'Invalid Length',
                message: `${field.name}'s length is ${typeof field.value === 'number' ? field.value.toString().length : field.value.length}, but it should be no greater than ${field.width}.`
            });
        }
    });
    return true;
}
exports.validateLengths = validateLengths;
function getNextMultipleDiff(value, multiple) {
    return (value + (multiple - value % multiple)) - value;
}
exports.getNextMultipleDiff = getNextMultipleDiff;
// Validate the data given is of the correct ACH data type
function validateDataTypes(object) {
    Object.keys(object).forEach((k) => {
        const field = object[k];
        if ('blank' in field && field.blank !== true) {
            switch (field.type) {
                case 'numeric': {
                    (0, utils_1.testRegex)(numericRegex, field);
                    break;
                }
                case 'alpha': {
                    (0, utils_1.testRegex)(alphaRegex, field);
                    break;
                }
                case 'alphanumeric': {
                    (0, utils_1.testRegex)(alphanumericRegex, field);
                    break;
                }
                default: {
                    throw new error_1.default({
                        name: 'Invalid Data Type',
                        message: `${field.name}'s data type is required to be ${field.type}, but its contents don't reflect that.`
                    });
                }
            }
        }
    });
    return true;
}
exports.validateDataTypes = validateDataTypes;
function validateACHAddendaTypeCode(addendaTypeCode) {
    if (addendaTypeCode.length !== 2 || ACHAddendaTypeCodes.includes(addendaTypeCode) === false) {
        throw new error_1.default({
            name: 'ACH Addenda Type Code Error',
            message: `The ACH addenda type code ${addendaTypeCode} is invalid. Please pass a valid 2-digit addenda type code.`,
        });
    }
    return true;
}
exports.validateACHAddendaTypeCode = validateACHAddendaTypeCode;
// Insure a given transaction code is valid
function validateACHCode(transactionCode) {
    if (transactionCode.length !== 2 || ACHTransactionCodes.includes(transactionCode) === false) {
        throw new error_1.default({
            name: 'ACH Transaction Code Error',
            message: `The ACH transaction code ${transactionCode} is invalid. Please pass a valid 2-digit transaction code.`
        });
    }
    return true;
}
exports.validateACHCode = validateACHCode;
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
function validateRoutingNumber(routing) {
    if (typeof routing === 'number')
        routing = routing.toString();
    // Make sure the routing number is exactly 9-digits long
    if (routing.length !== 9) {
        throw new error_1.default({
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
        throw new error_1.default({
            name: 'Invalid ABA Number',
            message: `The ABA routing number ${routing} is invalid. Please ensure a valid 9-digit ABA routing number is passed.`,
        });
    }
    return true;
}
exports.validateRoutingNumber = validateRoutingNumber;
module.exports = {
    validateRequiredFields,
    validateLengths,
    validateDataTypes,
    validateACHAddendaTypeCode,
    validateACHCode,
    validateRoutingNumber,
    getNextMultipleDiff,
};
