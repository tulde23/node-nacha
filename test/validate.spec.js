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
            const { validateRequiredFields } = (0, validate_1.default)(this);
            const testObjectOne = {
                fieldOne: {
                    name: 'fieldOne',
                    width: 6,
                    position: 9,
                    required: true,
                    type: 'alphanumeric',
                    value: ''
                }
            };
            // The function should throw an error since the field is required but the value is '' (empty string)
            expect(() => validateRequiredFields(testObjectOne))
                .to.throw('fieldOne is a required field but its value is: ');
            // Change the value to a valid alphanumeric string
            testObjectOne.fieldOne.value = 'some value';
            // Make sure the function doesn't throw an error.
            expect(() => validateRequiredFields(testObjectOne))
                .not.to.throw('fieldOne is a required field but its value is: ');
        });
    });
    describe('Optional Fields', function () {
        it('can be left blank without throwing an error', function () {
            const { validateRequiredFields } = (0, validate_1.default)(this);
            const testObjectOne = {
                fieldOne: {
                    name: 'fieldOne',
                    width: 6,
                    position: 9,
                    required: false,
                    type: 'alphanumeric',
                    value: ''
                }
            };
            // The expect should not throw an error since the field is not required so an empty string is okay.
            expect(() => { validateRequiredFields(testObjectOne); })
                .not.to.throw('fieldOne is a required field but its value is: ');
        });
    });
    describe('Lengths', function () {
        it('must not exceed their width (length) property', function () {
            const { validateLengths } = (0, validate_1.default)(this);
            const testObjectOne = {
                fieldOne: {
                    name: 'fieldOne',
                    width: 6,
                    position: 9,
                    required: false,
                    type: 'alphanumeric',
                    value: '1234567'
                }
            };
            // The function should throw an error since the field's value exceeds its width.
            expect(() => { validateLengths(testObjectOne); })
                .to.throw('fieldOne\'s length is 7, but it should be no greater than 6.');
            // Change the field's value to a string within the field's maximum width.
            testObjectOne.fieldOne.value = 'isokay';
            // Now that the value is within the field's limit, it shouldn't throw an error.
            expect(() => { validateLengths(testObjectOne); })
                .not.to.throw('fieldOne\'s length is 7, but it should be no greater than 6.');
        });
    });
    describe('Data Types (alpha)', function () {
        it('must correspond to the alpha data type', function () {
            const { validateDataTypes } = (0, validate_1.default)(this);
            const testObjectOne = {
                fieldOne: {
                    name: 'fieldOne',
                    width: 10,
                    position: 9,
                    required: false,
                    type: 'alpha',
                    value: '#199#'
                }
            };
            // The function should throw an error since the field's data type doesn't match its contents.
            expect(() => { validateDataTypes(testObjectOne); })
                .to.throw('fieldOne\'s data type is required to be alpha, but its contents don\'t reflect that.');
            // Change the field's value to a string which corresponds to its data type
            testObjectOne.fieldOne.value = 'validvalue';
            // Now that the value corresponds to its data type, it shouldn't throw an error.
            expect(() => { validateDataTypes(testObjectOne); })
                .not.to.throw('fieldOne\'s data type is required to be alpha, but its contents don\'t reflect that.');
        });
    });
    describe('Data Types (alphanumeric)', function () {
        it('must correspond to the alphanumeric data type', function () {
            const { validateDataTypes } = (0, validate_1.default)(this);
            const testObjectOne = {
                fieldOne: {
                    name: 'fieldOne',
                    width: 20,
                    position: 9,
                    required: false,
                    type: 'alphanumeric',
                    value: 'badData©'
                }
            };
            // The function should throw an error since the field's data type doesn't match its contents.
            expect(() => { validateDataTypes(testObjectOne); })
                .to.throw('fieldOne\'s data type is required to be alphanumeric, but its contents don\'t reflect that.');
            // Change the field's value to a string which corresponds to its data type
            testObjectOne.fieldOne.value = '@val1dval!';
            // Now that the value corresponds to its data type, it shouldn't throw an error.
            expect(() => { validateDataTypes(testObjectOne); })
                .not.to.throw('fieldOne\'s data type is required to be alphanumeric, but its contents don\'t reflect that.');
        });
    });
    describe('Data Types (numeric)', function () {
        it('must correspond to the numeric data type', function () {
            const { validateDataTypes } = (0, validate_1.default)(this);
            const testObjectOne = {
                fieldOne: {
                    name: 'fieldOne',
                    width: 15,
                    position: 9,
                    required: false,
                    type: 'numeric',
                    value: 'bad!Da$ta#'
                }
            };
            // The function should throw an error since the field's data type doesn't match its contents.
            expect(() => { validateDataTypes(testObjectOne); })
                .to.throw('fieldOne\'s data type is required to be numeric, but its contents don\'t reflect that.');
            // Change the field's value to a string which corresponds to its data type
            testObjectOne.fieldOne.value = '98712043';
            // Now that the value corresponds to its data type, it shouldn't throw an error.
            expect(() => { validateDataTypes(testObjectOne); })
                .not.to.throw('fieldOne\'s data type is required to be numeric, but its contents don\'t reflect that.');
        });
    });
    describe('Transaction Codes', function () {
        it('must be valid ACH codes', function () {
            const { validateACHCode } = (0, validate_1.default)(this);
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
            const { validateACHServiceClassCode } = (0, validate_1.default)(this);
            const validServiceClassCodes = ['200', '220', '225'], invalidServiceClassCodes = ['201', '222', '219'];
            // The function should not throw an error since all codes in the `validServiceClassCodes` array are valid ACH service class codes.
            validServiceClassCodes.forEach((code) => {
                expect(() => validateACHServiceClassCode(code))
                    .not.to.throw('The ACH service class code ' + code + ' is invalid. Please pass a valid 3-digit service class code.');
            });
            // Now we should expect errors since we're passing an array of invalid serivce class codes.
            invalidServiceClassCodes.forEach((code) => {
                expect(() => { validateACHServiceClassCode(code); })
                    .to.throw('The ACH service class code ' + code + ' is invalid. Please pass a valid 3-digit service class code.');
            });
        });
    });
    describe('Routing Numbers (ABA Numbers)', function () {
        it('must be valid 9-digit routing numbers', function () {
            const { validateRoutingNumber } = (0, validate_1.default)(this);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdGUuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZhbGlkYXRlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzNCLCtEQUEwQztBQUUxQyxRQUFRLENBQUMsVUFBVSxFQUFFO0lBQ25CLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixFQUFFLENBQUMsMENBQTBDLEVBQUU7WUFDN0MsTUFBTSxFQUFFLHNCQUFzQixFQUFFLEdBQUcsSUFBQSxrQkFBVyxFQUFDLElBQUksQ0FBQyxDQUFDO1lBRXJELE1BQU0sYUFBYSxHQUFHO2dCQUNwQixRQUFRLEVBQUU7b0JBQ1IsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLEtBQUssRUFBRSxDQUFDO29CQUNSLFFBQVEsRUFBRSxDQUFDO29CQUNYLFFBQVEsRUFBRSxJQUFJO29CQUNkLElBQUksRUFBRSxjQUFjO29CQUNwQixLQUFLLEVBQUUsRUFBRTtpQkFDVjthQUNGLENBQUM7WUFFRixvR0FBb0c7WUFDcEcsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUNoRCxFQUFFLENBQUMsS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7WUFFL0Qsa0RBQWtEO1lBQ2xELGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFlBQVksQ0FBQztZQUU1QyxpREFBaUQ7WUFDakQsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUNoRCxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1FBQ3JFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFD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