import { NumericalString } from './Types.js';
import Batch from './batch/Batch.js';
import { BatchControls, BatchHeaders } from './batch/batchTypes.js';
import EntryAddenda from './entry-addenda/EntryAddenda.js';
import { EntryAddendaFields } from './entry-addenda/entryAddendaTypes.js';
import Entry from './entry/Entry.js';
import { EntryFields } from './entry/entryTypes.js';
import nACHError from './error.js';
import File from './file/File.js';
import { FileControls, FileHeaders } from './file/FileTypes.js';
import { testRegex } from './utils.js';

const numericRegex = /^[0-9]+$/;
const alphaRegex = /^[a-zA-Z]+$/;
// Solves -> https://github.com/wilix-team/node-nach/issues/4
// eslint-disable-next-line no-useless-escape
const alphanumericRegex = /(^[0-9a-zA-Z!"#$%&'()*+,-.\/:;<>=?@\[\]\\^_`{}|~ ]+$)|(^$)/;

export default function validations(classDefinition: File|Batch|Entry|EntryAddenda){
  const debug = classDefinition.debug;

  return {
    validateRequiredFields: (object: EntryAddendaFields|EntryFields|BatchHeaders|BatchControls|FileHeaders|FileControls) => {
      Object.values(object).forEach((field) => {
        // This check ensures a required field's value is not NaN, null, undefined or empty.
        // Zero is valid, but the data type check will make sure any fields with 0 are numeric.
        if (
            ('required' in field && typeof field.required === 'boolean' && field.required === true)
            && (('value' in field === false) || (field.value === undefined) || field.value.toString().length === 0)
          ) {
          if (debug){
            console.debug('[validateRequiredFields::Failed Because]', {
              name: field.name,
              value: field.value,
              required: field.required,
              length: field.value.toString().length,
            })
          }
    
          throw new nACHError({
            name: 'Required Field Blank',
            message: `${field.name} is a required field but its value is: ${field.value}`
          });
        }
      });
    
      return true;
    },
    validateRoutingNumber: (routing: NumericalString|number) => {
      const tempRouting = `${routing}`
    
      // Make sure the routing number is exactly 9-digits long
      if (tempRouting.length !== 9) {
        throw new nACHError({
          name: 'Invalid ABA Number Length',
          message: `The ABA routing number ${routing} is ${tempRouting.length}-digits long, but it should be 9-digits long.`
        });
      }
    
      // Split the routing number into an array of numbers. `array` will look like this: `[2,8,1,0,8,1,4,7,9]`.
      const array = tempRouting.split('').map(Number);
    
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
    },
    validateLengths: (object: EntryAddendaFields|EntryFields|BatchHeaders|BatchControls|FileHeaders|FileControls) => {
      Object.values(object).forEach((field) => {
        if (field.value.toString().length > field.width) {
          throw new nACHError({
            name: 'Invalid Length',
            message: `${field.name}'s length is ${(typeof field.value === 'number') ? field.value.toString().length : field.value.length}, but it should be no greater than ${field.width}.`
          });
        }
      });
    
      return true;
    },
    validateDataTypes: (object: EntryAddendaFields|EntryFields|BatchHeaders|BatchControls|FileHeaders|FileControls) => {
      Object.values(object).forEach((field) => {
        if (('blank' in field) === false || ('blank' in field && field.blank === false)) {
          switch (field.type) {
            case 'numeric': { testRegex(numericRegex, field); break; }
            case 'alpha': { testRegex(alphaRegex, field); break; }
            case 'alphanumeric':{ testRegex(alphanumericRegex, field); break; }
            case 'ABA': { break; }
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
    },
    validateACHCode: (transactionCode: NumericalString) => {
      const ACHTransactionCodes = ['22', '23', '24', '27', '28', '29', '32', '33', '34', '37', '38', '39'] as Array<NumericalString>;

      if (transactionCode.length !== 2 || ACHTransactionCodes.includes(transactionCode) === false) {
        if (debug){
          console.debug('[validateACHCode::Failed Because]', {
            transactionCode,
            ACHTransactionCodes,
            includes: ACHTransactionCodes.includes(transactionCode),
          })
        }
        throw new nACHError({
          name: 'ACH Transaction Code Error',
          message: 'The ACH transaction code ' + transactionCode + ' is invalid. Please pass a valid 2-digit transaction code.'
        });
      }
    
      return true;
    },
    validateACHAddendaTypeCode: (addendaTypeCode: NumericalString) => {
      const ACHAddendaTypeCodes = ['02', '05', '98', '99'] as Array<NumericalString>;

      if (addendaTypeCode.length !== 2 || ACHAddendaTypeCodes.includes(addendaTypeCode) === false) {
        throw new nACHError({
          name: 'ACH Addenda Type Code Error',
          message: 'The ACH addenda type code ' + addendaTypeCode + ' is invalid. Please pass a valid 2-digit addenda type code.'
        });
      }
    
      return true;
    },
    validateACHServiceClassCode: (serviceClassCode: NumericalString) => {
      const ACHServiceClassCodes = ['200', '220', '225'] as Array<NumericalString>;

      if (serviceClassCode.length !== 3 || ACHServiceClassCodes.includes(serviceClassCode) === false) {
        throw new nACHError({
          name: 'ACH Service Class Code Error',
          message: 'The ACH service class code ' + serviceClassCode + ' is invalid. Please pass a valid 3-digit service class code.'
        });
      }
    
      return true;
    },
    getNextMultipleDiff: (value: number, multiple: number) => {
      return (value + (multiple - value % multiple)) - value;
    }
  }
}

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
