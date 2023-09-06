//TODO: Maybe validate position with indexes
import { testRegex } from './utils';
import nACHError from './error';
import { NumericalString } from './Types.js';



const ACHAddendaTypeCodes = ['02', '05', '98', '99'] as Array<NumericalString>;
const ACHTransactionCodes = ['22', '23', '24', '27', '28', '29', '32', '33', '34', '37', '38', '39'] as Array<NumericalString>;
const ACHServiceClassCodes = ['200', '220', '225'] as Array<NumericalString>;
const numericRegex = /^[0-9]+$/;
const alphaRegex = /^[a-zA-Z]+$/;
const alphanumericRegex = /(^[0-9a-zA-Z!"#$%&'()*+,-.\/:;<>=?@\[\]\\^_`{}|~ ]+$)|(^$)/;

// Validate required fields to make sure they have values
export function validateRequiredFields(object: Record<string, unknown>) {
  Object.keys(object).forEach((k) => {
    const field = object[k] as { required?: boolean; value?: string; name: string; };
    // This check ensures a required field's value is not NaN, null, undefined or empty.
    // Zero is valid, but the data type check will make sure any fields with 0 are numeric.
    if (
        ('required' in field && typeof field.required === 'boolean' && field.required === true)
        && (('value' in field === false) || (!field.value) || field.value.toString().length === 0)
      ) {
      throw new nACHError({
        name: 'Required Field Blank',
        message: `${field.name} is a required field but its value is: ${field.value}`
      });
    }
  });

  return true;
}

// Validate the lengths of fields by using their `width` property
export function validateLengths(object: Record<string, unknown>) {
  Object.keys(object).forEach((k) => {
    const field = object[k] as { width: number; value: string; name: string; };

    if (field.value.toString().length > field.width) {
      throw new nACHError({
        name: 'Invalid Length',
        message: `${field.name}'s length is ${field.value.length}, but it should be no greater than ${field.width}.`
      });
    }
  });

  return true;
}

export function getNextMultipleDiff(value: number, multiple: number) {
  return (value + (multiple - value % multiple)) - value;
}

// Validate the data given is of the correct ACH data type
export function validateDataTypes(object: Record<string, unknown>) {
  Object.keys(object).forEach((k) => {
    const field = object[k] as { blank?: boolean; type: 'numeric'|'alpha'|'alphanumeric'; value: string; name: string; };

    if ('blank' in field && field.blank !== true) {
      switch (field.type) {
        case 'numeric': { testRegex(numericRegex, field); break; }
        case 'alpha': { testRegex(alphaRegex, field); break; }
        case 'alphanumeric':{ testRegex(alphanumericRegex, field); break; }
        default: {
          throw new nACHError({
            name: 'Invalid Data Type',
            message: `${field.name}'s data type is required to be ${field.type as string}, but its contents don't reflect that.`
          });
        }
      }
    }
  });

  return true;
}

export function validateACHAddendaTypeCode(addendaTypeCode: NumericalString) {
  if (addendaTypeCode.length !== 2 || ACHAddendaTypeCodes.includes(addendaTypeCode) === false) {
    throw new nACHError({
      name: 'ACH Addenda Type Code Error',
      message: `The ACH addenda type code ${addendaTypeCode} is invalid. Please pass a valid 2-digit addenda type code.`,
    });
  }

  return true;
}

// Insure a given transaction code is valid
export function validateACHCode(transactionCode: NumericalString) {
  if (transactionCode.length !== 2 || ACHTransactionCodes.includes(transactionCode) === false) {
    throw new nACHError({
      name: 'ACH Transaction Code Error',
      message: `The ACH transaction code ${transactionCode} is invalid. Please pass a valid 2-digit transaction code.`
    });
  }

  return true;
}

// Insure a given transaction code is valid
export function validateACHAddendaCode(transactionCode: NumericalString) {
  // if (transactionCode.length !== 2 || !_.includes(ACHTransactionCodes, transactionCode)) {
  //   throw new nACHError({
  //     name: 'ACH Transaction Code Error',
  //     message: 'The ACH transaction code ' + transactionCode + ' is invalid for addenda records. Please pass a valid 2-digit transaction code.'
  //   });
  // }

  return true;
} //? WTF is this function for?

export function validateACHServiceClassCode(serviceClassCode: NumericalString) {
  if (serviceClassCode.length !== 3 || ACHServiceClassCodes.includes(serviceClassCode) === false) {
    throw new nACHError({
      name: 'ACH Service Class Code Error',
      message: `The ACH service class code ${serviceClassCode} is invalid. Please pass a valid 3-digit service class code.`,
    });
  }

  return true;
}

export function validateRoutingNumber(routing: NumericalString|number) {
  if (typeof routing === 'number') routing = routing.toString() as NumericalString;

  // Make sure the routing number is exactly 9-digits long
  if (routing.length !== 9) {
    throw new nACHError({
      name: 'Invalid ABA Number Length',
      message: `The ABA routing number ${routing} is ${routing.length}-digits long, but it should be 9-digits long.`
    });
  }

  // Split the routing number into an array of numbers. `array` will look like this: `[2,8,1,0,8,1,4,7,9]`.
  const array = routing.split('').map(Number);

  // Validate the routing number (ABA). See here for more info: http://www.brainjar.com/js/validation/
  const sum =
    3 * (array[0] + array[3] + array[6]) +
    7 * (array[1] + array[4] + array[7]) +
    1 * (array[2] + array[5] + array[8]);

  // Throw an error if the the result of `sum` modulo 10 is not zero. The value of `sum` must be a multiple of 10 to be a valid routing number.
  if (sum % 10 !== 0) {
    throw new nACHError({
      name: 'Invalid ABA Number',
      message: `The ABA routing number ${routing} is invalid. Please ensure a valid 9-digit ABA routing number is passed.`,
    });
  }

  return true;
}

module.exports = {
  validateRequiredFields,
  validateLengths,
  validateDataTypes,
  validateACHAddendaTypeCode,
  validateACHCode,
  validateACHAddendaCode,
  validateACHServiceClassCode,
  validateRoutingNumber,
  getNextMultipleDiff,
}
