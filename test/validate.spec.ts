import * as chai from 'chai';
const expect = chai.expect;
import validations from '../lib/validate';
import { EntryFieldWithStringValue, EntryFields } from '../lib/entry/entryTypes.js';
import { NumericalString } from '../lib/Types.js';

describe('Validate', function() {
  describe('Required Fields', function() {
    it('must have contents or an error is thrown', function() {
      const { validateRequiredFields } = validations({ debug: false });

      const testObjectOne: Partial<EntryFields> = {
        'individualName': {
          name: 'Individual Name',
          width: 6,
          position: 9,
          required: true,
          type: 'alphanumeric',
          value: ''
        } as EntryFieldWithStringValue<'individualName'>
      };

      // The function should throw an error since the field is required but the value is '' (empty string)
      expect(() => validateRequiredFields(testObjectOne as EntryFields))
        .to.throw('Individual Name is a required field but its value is: ');

      // Change the value to a valid alphanumeric string
      testObjectOne.individualName.value = 'some value';

      // Make sure the function doesn't throw an error.
      expect(() => validateRequiredFields(testObjectOne as EntryFields))
        .not.to.throw('Individual Name is a required field but its value is: ');
    });
  });

  describe('Optional Fields', function() {
    it('can be left blank without throwing an error', function() {
      const { validateRequiredFields } = validations({ debug: false });

      const testObjectOne: Partial<EntryFields> = {
        individualName: {
          name: 'Individual Name',
          width: 6,
          position: 9,
          required: false,
          type: 'alphanumeric',
          value: ''
        } as EntryFieldWithStringValue<'individualName'>
      };

      // The expect should not throw an error since the field is not required so an empty string is okay.
      expect(() => { validateRequiredFields(testObjectOne as EntryFields) })
        .not.to.throw('Individual Name is a required field but its value is: ');
    });
  });

  describe('Lengths', function() {
    it('must not exceed their width (length) property', function() {
      const { validateLengths } = validations({ debug: false });

      const testObjectOne: Partial<EntryFields> = {
        individualName: {
          name: 'Individual Name',
          width: 6,
          position: 9,
          required: false,
          type: 'alphanumeric',
          value: '1234567'
        } as EntryFieldWithStringValue<'individualName'>
      };

      // The function should throw an error since the field's value exceeds its width.
      expect(() => { validateLengths(testObjectOne as EntryFields) })
        .to.throw('Individual Name\'s length is 7, but it should be no greater than 6.');

      // Change the field's value to a string within the field's maximum width.
      testObjectOne.individualName.value = 'isokay';

      // Now that the value is within the field's limit, it shouldn't throw an error.
      expect(() => { validateLengths(testObjectOne as EntryFields) })
        .not.to.throw('Individual Name\'s length is 7, but it should be no greater than 6.');
    });
  });

  describe('Data Types (alpha)', function() {
    it('must correspond to the alpha data type', function() {
      const { validateDataTypes } = validations({ debug: false });

      const testObjectOne: Partial<EntryFields> = {
        individualName: {
          name: 'Individual Name',
          width: 10,
          position: 9,
          required: false,
          type: 'alpha',
          value: '#199#'
        } as EntryFieldWithStringValue<'individualName'>
      };

      // The function should throw an error since the field's data type doesn't match its contents.
      expect(() => { validateDataTypes(testObjectOne as EntryFields) })
        .to.throw('Individual Name\'s data type is required to be alpha, but its contents don\'t reflect that.');

      // Change the field's value to a string which corresponds to its data type
      testObjectOne.individualName.value = 'validvalue';

      // Now that the value corresponds to its data type, it shouldn't throw an error.
      expect(() => { validateDataTypes(testObjectOne as EntryFields) })
        .not.to.throw('Individual Name\'s data type is required to be alpha, but its contents don\'t reflect that.');
    });
  });

  describe('Data Types (alphanumeric)', function() {
    it('must correspond to the alphanumeric data type', function() {
      const { validateDataTypes } = validations({ debug: false });

      const testObjectOne: Partial<EntryFields> = {
        individualName: {
          name: 'Individual Name',
          width: 20,
          position: 9,
          required: false,
          type: 'alphanumeric',
          value: 'badData©'
        } as EntryFieldWithStringValue<'individualName'>
      };

      // The function should throw an error since the field's data type doesn't match its contents.
      expect(() => { validateDataTypes(testObjectOne as EntryFields) })
        .to.throw('Individual Name\'s data type is required to be alphanumeric, but its contents don\'t reflect that.');

      // Change the field's value to a string which corresponds to its data type
      testObjectOne.individualName.value = '@val1dval!';

      // Now that the value corresponds to its data type, it shouldn't throw an error.
      expect(() => { validateDataTypes(testObjectOne as EntryFields) })
        .not.to.throw('Individual Name\'s data type is required to be alphanumeric, but its contents don\'t reflect that.');
    });
  });

  describe('Data Types (numeric)', function() {
    it('must correspond to the numeric data type', function() {
      const { validateDataTypes } = validations({ debug: false });

      const testObjectOne: Partial<EntryFields> = {
        individualName: {
          name: 'Individual Name',
          width: 15,
          position: 9,
          required: false,
          type: 'numeric',
          value: 'bad!Da$ta#'
        } as EntryFieldWithStringValue<'individualName'>
      };

      // The function should throw an error since the field's data type doesn't match its contents.
      expect(() => { validateDataTypes(testObjectOne as EntryFields) })
        .to.throw('Individual Name\'s data type is required to be numeric, but its contents don\'t reflect that.');

      // Change the field's value to a string which corresponds to its data type
      testObjectOne.individualName.value = '98712043';

      // Now that the value corresponds to its data type, it shouldn't throw an error.
      expect(() => { validateDataTypes(testObjectOne as EntryFields) })
        .not.to.throw('Individual Name\'s data type is required to be numeric, but its contents don\'t reflect that.');
    });
  });

  describe('Transaction Codes', function() {
    it('must be valid ACH codes', function() {
      const { validateACHCode } = validations({ debug: false });

      const validTransactionCodes = ['22', '23', '24', '27', '28', '29', '32', '33', '34', '37', '38', '39'];
      const invalidTransactionCodes = ['21', '25', '26', '15', '82', '30', '31', '35', '36', '73', '18', '40'];

      // The function should not throw an error since all codes in the `validTransactionCodes` array are valid ACH transaction codes.
      validTransactionCodes.forEach((code) => {
        expect(() => validateACHCode(code as NumericalString))
          .not.to.throw('The ACH transaction code ' + code + ' is invalid. Please pass a valid 2-digit transaction code.');
      });

      // Now we should expect errors since we're passing an array of invalid transaction codes.
      invalidTransactionCodes.forEach((code) => {
        expect(() => validateACHCode(code as NumericalString))
          .to.throw('The ACH transaction code ' + code + ' is invalid. Please pass a valid 2-digit transaction code.');
      });
    });
  });

  describe('Service Class Codes', function() {
    it('must be valid ACH codes', function() {
      const { validateACHServiceClassCode } = validations({ debug: false });

      const validServiceClassCodes = ['200', '220', '225']
        , invalidServiceClassCodes = ['201', '222', '219'];

      // The function should not throw an error since all codes in the `validServiceClassCodes` array are valid ACH service class codes.
      validServiceClassCodes.forEach((code) => {
        expect(() => validateACHServiceClassCode(code as NumericalString))
          .not.to.throw('The ACH service class code ' + code + ' is invalid. Please pass a valid 3-digit service class code.');
      });

      // Now we should expect errors since we're passing an array of invalid service class codes.
      invalidServiceClassCodes.forEach((code) => {
        expect(() => { validateACHServiceClassCode(code as NumericalString) })
          .to.throw('The ACH service class code ' + code + ' is invalid. Please pass a valid 3-digit service class code.');
      });
    });
  });

  describe('Routing Numbers (ABA Numbers)', function() {
    it('must be valid 9-digit routing numbers', function() {
      const { validateRoutingNumber } = validations({ debug: false });

      const validRoutingNumber = '281074114'
        , invalidRoutingNumber = '281074119';

      // The function should not throw an error since this is a valid routing number.
      expect(() => { validateRoutingNumber(validRoutingNumber) })
        .not.to.throw('The ABA routing number ' + validRoutingNumber + ' is invalid. Please ensure a valid 9-digit ABA routing number is passed.');

      // The function should throw an error since this is not a valid routing number.
      expect(() => { validateRoutingNumber(invalidRoutingNumber) })
        .to.throw('The ABA routing number ' + invalidRoutingNumber + ' is invalid. Please ensure a valid 9-digit ABA routing number is passed.');
    });
  });
});
