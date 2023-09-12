"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeBusinessDay = exports.isBusinessDay = exports.formatTime = exports.formatDateToYYMMDD = exports.parseYYMMDD = exports.getNextMultipleDiff = exports.getNextMultiple = exports.unique = exports.isEntryAddendaOptions = exports.isBatchHeaderOverrides = exports.isBatchOverrides = exports.compareSets = exports.generateString = exports.testRegex = exports.computeCheckDigit = exports.pad = exports.addNumericalString = void 0;
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
    const value = a.length !== 8
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
                        ? parseFloat(field.value).toFixed(2).replace(".", "")
                        : field.value;
                    const paddingChar = ('paddingChar' in field) ? field.paddingChar : '0';
                    result = result + pad(string, field.width, false, paddingChar);
                }
                counter++;
            }
        });
    }
    return result;
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
function isEntryAddendaOptions(arg) {
    if (typeof arg !== 'object')
        return false;
    if (Object.keys(arg).length === 0)
        return false;
    if ('fields' in arg)
        return true;
    return false;
}
exports.isEntryAddendaOptions = isEntryAddendaOptions;
function unique() { return counter++; }
exports.unique = unique;
function getNextMultiple(value, multiple) {
    return value % multiple == 0 ? value : value + (multiple - value % multiple);
}
exports.getNextMultiple = getNextMultiple;
function getNextMultipleDiff(value, multiple) {
    return (getNextMultiple(value, multiple) - value);
}
exports.getNextMultipleDiff = getNextMultipleDiff;
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
    isEntryAddendaOptions,
    compareSets,
    pad,
    unique,
    testRegex,
    formatDateToYYMMDD,
    formatTime: exports.formatTime,
    generateString,
    getNextMultiple,
    computeCheckDigit,
    computeBusinessDay: exports.computeBusinessDay,
    getNextMultipleDiff,
};
