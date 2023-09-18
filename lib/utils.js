"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeBusinessDay = exports.isBusinessDay = exports.formatTime = exports.formatDateToYYMMDD = exports.parseYYMMDD = exports.getNextMultipleDiff = exports.getNextMultiple = exports.unique = exports.isBatchHeaderOverrides = exports.isBatchOverrides = exports.compareSets = exports.generateString = exports.testRegex = exports.computeCheckDigit = exports.pad = exports.addNumericalString = void 0;
const error_1 = __importDefault(require("./error"));
const overrides_js_1 = require("./overrides.js");
let counter = 0;
function addNumericalString(valueStringOne, valueStringTwo) {
    return valueStringOne + valueStringTwo;
}
exports.addNumericalString = addNumericalString;
// Pad a given string to a fixed width using any character or number (defaults to one blank space)
// Both a string and width are required params for this function, but it also takes two optional
// parameters. First, a boolean called 'padRight' which by default is true. This means padding 
// will be applied to the right side of the string. Setting this to false will pad the left side of the
// string. You can also specify the character you want to use to pad the string.
function pad(str, width, padRight = true, padChar = ' ') {
    if (typeof str === 'number')
        str = str.toString();
    if (typeof str !== 'string')
        throw new TypeError('pad() requires a string or number to pad');
    if (str.length >= width) {
        return str;
    }
    else {
        return padRight
            ? str.padEnd(width, padChar)
            : str.padStart(width, padChar);
    }
}
exports.pad = pad;
function computeCheckDigit(routing) {
    if (typeof routing === 'number')
        routing = routing.toString();
    const a = routing.split('').map(Number);
    const value = (a.length !== 8)
        ? routing
        : routing + (7 * (a[0] + a[3] + a[6]) + 3 * (a[1] + a[4] + a[7]) + 9 * (a[2] + a[5])) % 10;
    return value;
}
exports.computeCheckDigit = computeCheckDigit;
// This function is passed a field and a regex and tests the field's value property against the given regex
function testRegex(regex, field) {
    const string = field.number
        ? parseFloat(field.value).toFixed(2).replace(/\./, '')
        : field.value;
    if (!regex.test(string)) {
        throw new error_1.default({
            name: 'Invalid Data Type',
            message: `${field.name}'s data type is required to be ${field.type}, but its contents don't reflect that.`
        });
    }
    return true;
}
exports.testRegex = testRegex;
function generateString(object) {
    return new Promise((resolve) => {
        let counter = 1;
        let result = '';
        const objectCount = Object.keys(object).length;
        while (counter < objectCount) {
            Object.values(object).forEach((field) => {
                if (field.position === counter) {
                    if (field.value && (('blank' in field && field.blank === true) || field.type === 'alphanumeric')) {
                        result = result + pad(field.value, field.width);
                    }
                    else {
                        const string = ('number' in field && field.number)
                            ? parseFloat(field.value).toFixed(2).replace('.', '')
                            : field.value;
                        const paddingChar = ('paddingChar' in field) ? field.paddingChar : '0';
                        result = result + pad(string, field.width, false, paddingChar);
                    }
                    counter++;
                }
            });
        }
        resolve(result);
    });
}
exports.generateString = generateString;
function compareSets(set1, set2) {
    if (set1.size !== set2.size)
        return false;
    for (const item of set1) {
        if (!set2.has(item))
            return false;
    }
    return true;
}
exports.compareSets = compareSets;
function isBatchOverrides(arg) {
    return compareSets(new Set(arg), overrides_js_1.highLevelHeaderOverrideSet)
        || compareSets(new Set(arg), overrides_js_1.highLevelControlOverrideSet);
}
exports.isBatchOverrides = isBatchOverrides;
function isBatchHeaderOverrides(arg) {
    return compareSets(new Set(arg), overrides_js_1.highLevelHeaderOverrideSet);
}
exports.isBatchHeaderOverrides = isBatchHeaderOverrides;
function unique() { return counter++; }
exports.unique = unique;
function getNextMultiple(value, multiple) {
    return (value % multiple == 0) ? value : (value + (multiple - value % multiple));
}
exports.getNextMultiple = getNextMultiple;
function getNextMultipleDiff(value, multiple) {
    return (getNextMultiple(value, multiple) - value);
}
exports.getNextMultipleDiff = getNextMultipleDiff;
/**
 *
 * @param dateString
 * @returns
 */
function parseYYMMDD(dateString) {
    const year = dateString.slice(0, 2);
    const month = dateString.slice(2, 4);
    const day = dateString.slice(4, 6);
    const date = new Date(`20${year}-${month}-${day}`);
    date.setHours(date.getHours() + 12); // Keeps it from converting back as a day behind
    return date;
}
exports.parseYYMMDD = parseYYMMDD;
// This allows us to create a valid ACH date in the YYMMDD format
function formatDateToYYMMDD(date) {
    const year = date.getFullYear().toString().substr(2, 4);
    const month = ((date.getMonth() + 1) < 10) // months are numbered 0-11 in JavaScript
        ? `0${(date.getMonth() + 1)}`
        : (date.getMonth() + 1).toString();
    const day = (date.getDate() < 10)
        ? `0${date.getDate()}`
        : date.getDate().toString();
    return `${year + month.toString() + day}`;
}
exports.formatDateToYYMMDD = formatDateToYYMMDD;
// Create a valid timestamp used by the ACH system in the HHMM format
const formatTime = function (date) {
    const hour = date.getHours().toString();
    const minute = date.getMinutes().toString();
    return pad(hour, 2, false, '0') + pad(minute, 2, false, '0');
};
exports.formatTime = formatTime;
const isBusinessDay = function (day) {
    const d = new Date(day).getDay();
    return (d !== 0 && d !== 6) ? true : false;
};
exports.isBusinessDay = isBusinessDay;
// This function takes an optional starting date to iterate from based on the number of business days provided.
const computeBusinessDay = function (businessDays, startingDate) {
    const date = startingDate || new Date();
    let days = 0;
    while (days < businessDays) {
        date.setDate(date.getDate() + 1);
        if ((0, exports.isBusinessDay)(date))
            days++;
    }
    return date;
};
exports.computeBusinessDay = computeBusinessDay;
module.exports = {
    addNumericalString,
    isBatchHeaderOverrides,
    compareSets,
    pad,
    unique,
    testRegex,
    parseYYMMDD,
    formatDateToYYMMDD,
    formatTime: exports.formatTime,
    generateString,
    getNextMultiple,
    computeCheckDigit,
    computeBusinessDay: exports.computeBusinessDay,
    getNextMultipleDiff,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBSUEsb0RBQWdDO0FBRWhDLGlEQUF5RjtBQUN6RixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7QUFFaEIsU0FBZ0Isa0JBQWtCLENBQUMsY0FBK0IsRUFBRSxjQUErQjtJQUNqRyxPQUFPLGNBQWMsR0FBRyxjQUFpQyxDQUFDO0FBQzVELENBQUM7QUFGRCxnREFFQztBQUVELGtHQUFrRztBQUNsRyxnR0FBZ0c7QUFDaEcsK0ZBQStGO0FBQy9GLHVHQUF1RztBQUN2RyxnRkFBZ0Y7QUFDaEYsU0FBZ0IsR0FBRyxDQUNqQixHQUFTLEVBQUUsS0FBYSxFQUFFLFdBQW1CLElBQWMsRUFBRSxVQUFnQixHQUFXO0lBRXhGLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUTtRQUFFLEdBQUcsR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFVLENBQUM7SUFDMUQsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRO1FBQUUsTUFBTSxJQUFJLFNBQVMsQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO0lBQzdGLElBQUksR0FBRyxDQUFDLE1BQU0sSUFBSSxLQUFLLEVBQUU7UUFDdkIsT0FBTyxHQUFHLENBQUM7S0FDWjtTQUFNO1FBQ0wsT0FBTyxRQUFRO1lBQ2IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQztZQUM1QixDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDbEM7QUFDSCxDQUFDO0FBWkQsa0JBWUM7QUFFRCxTQUFnQixpQkFBaUIsQ0FBQyxPQUEyQjtJQUMzRCxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVE7UUFBRSxPQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsRUFBaUIsQ0FBQztJQUM3RSxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsS0FB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