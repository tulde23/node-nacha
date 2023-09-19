"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai = __importStar(require("chai"));
const expect = chai.expect;
const validate_1 = __importDefault(require("../lib/validate"));
describe('Validate', function () {
    describe('Required Fields', function () {
        it('must have contents or an error is thrown', function () {
            const { validateRequiredFields } = (0, validate_1.default)({ debug: false });
            const testObjectOne = {
                'individualName': {
                    name: 'Individual Name',
                    width: 6,
                    position: 9,
                    required: true,
                    type: 'alphanumeric',
                    value: ''
                }
            };
            // The function should throw an error since the field is required but the value is '' (empty string)
            expect(() => validateRequiredFields(testObjectOne))
                .to.throw('Individual Name is a required field but its value is: ');
            // Change the value to a valid alphanumeric string
            testObjectOne.individualName.value = 'some value';
            // Make sure the function doesn't throw an error.
            expect(() => validateRequiredFields(testObjectOne))
                .not.to.throw('Individual Name is a required field but its value is: ');
        });
    });
    describe('Optional Fields', function () {
        it('can be left blank without throwing an error', function () {
            const { validateRequiredFields } = (0, validate_1.default)({ debug: false });
            const testObjectOne = {
                individualName: {
                    name: 'Individual Name',
                    width: 6,
                    position: 9,
                    required: false,
                    type: 'alphanumeric',
                    value: ''
                }
            };
            // The expect should not throw an error since the field is not required so an empty string is okay.
            expect(() => { validateRequiredFields(testObjectOne); })
                .not.to.throw('Individual Name is a required field but its value is: ');
        });
    });
    describe('Lengths', function () {
        it('must not exceed their width (length) property', function () {
            const { validateLengths } = (0, validate_1.default)({ debug: false });
            const testObjectOne = {
                individualName: {
                    name: 'Individual Name',
                    width: 6,
                    position: 9,
                    required: false,
                    type: 'alphanumeric',
                    value: '1234567'
                }
            };
            // The function should throw an error since the field's value exceeds its width.
            expect(() => { validateLengths(testObjectOne); })
                .to.throw('Individual Name\'s length is 7, but it should be no greater than 6.');
            // Change the field's value to a string within the field's maximum width.
            testObjectOne.individualName.value = 'isokay';
            // Now that the value is within the field's limit, it shouldn't throw an error.
            expect(() => { validateLengths(testObjectOne); })
                .not.to.throw('Individual Name\'s length is 7, but it should be no greater than 6.');
        });
    });
    describe('Data Types (alpha)', function () {
        it('must correspond to the alpha data type', function () {
            const { validateDataTypes } = (0, validate_1.default)({ debug: false });
            const testObjectOne = {
                individualName: {
                    name: 'Individual Name',
                    width: 10,
                    position: 9,
                    required: false,
                    type: 'alpha',
                    value: '#199#'
                }
            };
            // The function should throw an error since the field's data type doesn't match its contents.
            expect(() => { validateDataTypes(testObjectOne); })
                .to.throw('Individual Name\'s data type is required to be alpha, but its contents don\'t reflect that.');
            // Change the field's value to a string which corresponds to its data type
            testObjectOne.individualName.value = 'validvalue';
            // Now that the value corresponds to its data type, it shouldn't throw an error.
            expect(() => { validateDataTypes(testObjectOne); })
                .not.to.throw('Individual Name\'s data type is required to be alpha, but its contents don\'t reflect that.');
        });
    });
    describe('Data Types (alphanumeric)', function () {
        it('must correspond to the alphanumeric data type', function () {
            const { validateDataTypes } = (0, validate_1.default)({ debug: false });
            const testObjectOne = {
                individualName: {
                    name: 'Individual Name',
                    width: 20,
                    position: 9,
                    required: false,
                    type: 'alphanumeric',
                    value: 'badData©'
                }
            };
            // The function should throw an error since the field's data type doesn't match its contents.
            expect(() => { validateDataTypes(testObjectOne); })
                .to.throw('Individual Name\'s data type is required to be alphanumeric, but its contents don\'t reflect that.');
            // Change the field's value to a string which corresponds to its data type
            testObjectOne.individualName.value = '@val1dval!';
            // Now that the value corresponds to its data type, it shouldn't throw an error.
            expect(() => { validateDataTypes(testObjectOne); })
                .not.to.throw('Individual Name\'s data type is required to be alphanumeric, but its contents don\'t reflect that.');
        });
    });
    describe('Data Types (numeric)', function () {
        it('must correspond to the numeric data type', function () {
            const { validateDataTypes } = (0, validate_1.default)({ debug: false });
            const testObjectOne = {
                individualName: {
                    name: 'Individual Name',
                    width: 15,
                    position: 9,
                    required: false,
                    type: 'numeric',
                    value: 'bad!Da$ta#'
                }
            };
            // The function should throw an error since the field's data type doesn't match its contents.
            expect(() => { validateDataTypes(testObjectOne); })
                .to.throw('Individual Name\'s data type is required to be numeric, but its contents don\'t reflect that.');
            // Change the field's value to a string which corresponds to its data type
            testObjectOne.individualName.value = '98712043';
            // Now that the value corresponds to its data type, it shouldn't throw an error.
            expect(() => { validateDataTypes(testObjectOne); })
                .not.to.throw('Individual Name\'s data type is required to be numeric, but its contents don\'t reflect that.');
        });
    });
    describe('Transaction Codes', function () {
        it('must be valid ACH codes', function () {
            const { validateACHCode } = (0, validate_1.default)({ debug: false });
            const validTransactionCodes = ['22', '23', '24', '27', '28', '29', '32', '33', '34', '37', '38', '39'];
            const invalidTransactionCodes = ['21', '25', '26', '15', '82', '30', '31', '35', '36', '73', '18', '40'];
            // The function should not throw an error since all codes in the `validTransactionCodes` array are valid ACH transaction codes.
            validTransactionCodes.forEach((code) => {
                expect(() => validateACHCode(code))
                    .not.to.throw('The ACH transaction code ' + code + ' is invalid. Please pass a valid 2-digit transaction code.');
            });
            // Now we should expect errors since we're passing an array of invalid transaction codes.
            invalidTransactionCodes.forEach((code) => {
                expect(() => validateACHCode(code))
                    .to.throw('The ACH transaction code ' + code + ' is invalid. Please pass a valid 2-digit transaction code.');
            });
        });
    });
    describe('Service Class Codes', function () {
        it('must be valid ACH codes', function () {
            const { validateACHServiceClassCode } = (0, validate_1.default)({ debug: false });
            const validServiceClassCodes = ['200', '220', '225'], invalidServiceClassCodes = ['201', '222', '219'];
            // The function should not throw an error since all codes in the `validServiceClassCodes` array are valid ACH service class codes.
            validServiceClassCodes.forEach((code) => {
                expect(() => validateACHServiceClassCode(code))
                    .not.to.throw('The ACH service class code ' + code + ' is invalid. Please pass a valid 3-digit service class code.');
            });
            // Now we should expect errors since we're passing an array of invalid service class codes.
            invalidServiceClassCodes.forEach((code) => {
                expect(() => { validateACHServiceClassCode(code); })
                    .to.throw('The ACH service class code ' + code + ' is invalid. Please pass a valid 3-digit service class code.');
            });
        });
    });
    describe('Routing Numbers (ABA Numbers)', function () {
        it('must be valid 9-digit routing numbers', function () {
            const { validateRoutingNumber } = (0, validate_1.default)({ debug: false });
            const validRoutingNumber = '281074114', invalidRoutingNumber = '281074119';
            // The function should not throw an error since this is a valid routing number.
            expect(() => { validateRoutingNumber(validRoutingNumber); })
                .not.to.throw('The ABA routing number ' + validRoutingNumber + ' is invalid. Please ensure a valid 9-digit ABA routing number is passed.');
            // The function should throw an error since this is not a valid routing number.
            expect(() => { validateRoutingNumber(invalidRoutingNumber); })
                .to.throw('The ABA routing number ' + invalidRoutingNumber + ' is invalid. Please ensure a valid 9-digit ABA routing number is passed.');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZhbGlkYXRlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzNCLCtEQUEwQztBQUkxQyxRQUFRLENBQUMsVUFBVSxFQUFFO0lBQ25CLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixFQUFFLENBQUMsMENBQTBDLEVBQUU7WUFDN0MsTUFBTSxFQUFFLHNCQUFzQixFQUFFLEdBQUcsSUFBQSxrQkFBVyxFQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7WUFFakUsTUFBTSxhQUFhLEdBQXlCO2dCQUMxQyxnQkFBZ0IsRUFBRTtvQkFDaEIsSUFBSSxFQUFFLGlCQUFpQjtvQkFDdkIsS0FBSyxFQUFFLENBQUM7b0JBQ1IsUUFBUSxFQUFFLENBQUM7b0JBQ1gsUUFBUSxFQUFFLElBQUk7b0JBQ2QsSUFBSSxFQUFFLGNBQWM7b0JBQ3BCLEtBQUssRUFBRSxFQUFFO2lCQUNxQzthQUNqRCxDQUFDO1lBRUYsb0dBQW9HO1lBQ3BHLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxhQUE0QixDQUFDLENBQUM7aUJBQy9ELEVBQUUsQ0FBQyxLQUFLLENBQUMsd0RBQXdELENBQUMsQ0FBQztZQUV0RSxrREFBa0Q7WUFDbEQsYUFBYSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDO1lBRWxELGlEQUFpRDtZQUNqRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsc0JBQXNCLENBQUMsYUFBNEIsQ0FBQyxDQUFDO2lCQUMvRCxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO1FBQzVFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7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