"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newLineChar = exports.computeBusinessDay = exports.isBusinessDay = exports.formatTime = exports.formatDate = exports.getNextMultipleDiff = exports.getNextMultiple = exports.overrideLowLevel = exports.unique = exports.parseLine = exports.generateString = exports.testRegex = exports.computeCheckDigit = exports.pad = void 0;
const error_1 = __importDefault(require("./error"));
let counter = 0;
// Pad a given string to a fixed width using any character or number (defaults to one blank space)
// Both a string and width are required params for this function, but it also takes two optional
// parameters. First, a boolean called 'padRight' which by default is true. This means padding 
// will be applied to the right side of the string. Setting this to false will pad the left side of the
// string. You can also specify the character you want to use to pad the string.
function pad(str, width, padRight = true, padChar = ' ') {
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
    return a.length !== 8
        ? routing
        : routing + (7 * (a[0] + a[3] + a[6]) + 3 * (a[1] + a[4] + a[7]) + 9 * (a[2] + a[5])) % 10;
}
exports.computeCheckDigit = computeCheckDigit;
// This function is passed a field and a regex and tests the field's value property against the given regex
function testRegex(regex, field) {
    const string = field.number ? parseFloat(field.value).toFixed(2).replace(/\./, '') : field.value;
    if (!regex.test(string)) {
        throw new error_1.default({
            name: 'Invalid Data Type',
            message: field.name + '\'s data type is required to be ' + field.type + ', but its contents don\'t reflect that.'
        });
    }
    return true;
}
exports.testRegex = testRegex;
// This function iterates through the object passed in and checks to see if it has a "position" property. If so, we pad it, and then concatenate it where belongs.
function generateString(object, cb) {
    let result = '';
    Object.keys(object).forEach(key => {
        const field = object[key];
        if (field.position) {
            if (field.blank === true || field.type == 'alphanumeric') {
                result = result + pad(field.value, field.width);
            }
            else {
                const string = field.number ? parseFloat(field.value).toFixed(2).replace(/\./, '') : field.value;
                const paddingChar = field.paddingChar || '0';
                result = result + pad(string, field.width, false, paddingChar);
            }
        }
    });
    cb(result);
}
exports.generateString = generateString;
function parseLine(str, object) {
    // Rewrite in Modern JS
    let pos = 0;
    return Object.keys(object).reduce((result, key) => {
        const field = object[key];
        result[key] = str.substring(pos, field.width).trim();
        pos += field.width;
        return result;
    }, {});
}
exports.parseLine = parseLine;
function unique() { return counter++; }
exports.unique = unique;
function overrideLowLevel(values, options, self) {
    // For each override value, check to see if it exists on the options object & if so, set it
    values.forEach((field) => {
        if (options[field]) {
            self.set(field, options[field]);
        }
    });
}
exports.overrideLowLevel = overrideLowLevel;
function getNextMultiple(value, multiple) {
    return value % multiple == 0 ? value : value + (multiple - value % multiple);
}
exports.getNextMultiple = getNextMultiple;
function getNextMultipleDiff(value, multiple) {
    return (getNextMultiple(value, multiple) - value);
}
exports.getNextMultipleDiff = getNextMultipleDiff;
// This allows us to create a valid ACH date in the YYMMDD format
const formatDate = function (date) {
    const year = pad(date.getFullYear().toString().slice(-2), 2, false, '0');
    const month = pad((date.getMonth() + 1).toString(), 2, false, '0');
    const day = pad(date.getDate().toString(), 2, false, '0');
    return year + month + day;
};
exports.formatDate = formatDate;
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
// This function takes an optional starting date to iterate from based
// on the number of business days provided.
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
function newLineChar() { return '\r\n'; }
exports.newLineChar = newLineChar;
module.exports = {
    pad,
    unique,
    testRegex: testRegex,
    formatDate: exports.formatDate,
    formatTime: exports.formatTime,
    newLineChar,
    generateString,
    parseLine,
    getNextMultiple,
    overrideLowLevel,
    computeCheckDigit,
    computeBusinessDay: exports.computeBusinessDay,
    getNextMultipleDiff: getNextMultipleDiff,
};
