"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeBusinessDay = exports.isBusinessDay = exports.formatTime = exports.formatDateToYYMMDD = exports.parseYYMMDD = exports.getNextMultipleDiff = exports.getNextMultiple = exports.unique = exports.isBatchHeaderOverrides = exports.isBatchOverrides = exports.compareSets = exports.generateString = exports.testRegex = exports.computeCheckDigit = exports.pad = exports.addNumericalString = exports.deepMerge = void 0;
const error_1 = __importDefault(require("./error"));
const overrides_js_1 = require("./overrides.js");
function deepMerge(target, ...sources) {
    for (const source of sources) {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                const sourceValue = source[key];
                const targetValue = target[key];
                if (sourceValue instanceof Object && targetValue instanceof Object) {
                    target[key] = deepMerge(Object.create(null), targetValue, sourceValue);
                }
                else {
                    target[key] = sourceValue;
                }
            }
        }
    }
    return target;
}
exports.deepMerge = deepMerge;
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
let counter = 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBSUEsb0RBQWdDO0FBRWhDLGlEQUF5RjtBQUV6RixTQUFnQixTQUFTLENBQW1FLE1BQWMsRUFBRSxHQUFHLE9BQXVDO0lBQ3BKLEtBQUssTUFBTSxNQUFNLElBQUksT0FBTyxFQUFFO1FBQzVCLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFO1lBQ3hCLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDOUIsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQyxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsR0FBbUIsQ0FBQyxDQUFDO2dCQUVoRCxJQUFJLFdBQVcsWUFBWSxNQUFNLElBQUksV0FBVyxZQUFZLE1BQU0sRUFBRTtvQkFDbEUsTUFBTSxDQUFDLEdBQW1CLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxXQUFzQyxFQUFFLFdBQXNDLENBQXlCLENBQUM7aUJBQ3RLO3FCQUFNO29CQUNMLE1BQU0sQ0FBQyxHQUFtQixDQUFDLEdBQUcsV0FBeUMsQ0FBQztpQkFDekU7YUFDRjtTQUNGO0tBQ0Y7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBaEJELDhCQWdCQztBQUVELFNBQWdCLGtCQUFrQixDQUFDLGNBQStCLEVBQUUsY0FBK0I7SUFDakcsT0FBTyxjQUFjLEdBQUcsY0FBaUMsQ0FBQztBQUM1RCxDQUFDO0FBRkQsZ0RBRUM7QUFFRCxrR0FBa0c7QUFDbEcsZ0dBQWdHO0FBQ2hHLCtGQUErRjtBQUMvRix1R0FBdUc7QUFDdkcsZ0ZBQWdGO0FBQ2hGLFNBQWdCLEdBQUcsQ0FDakIsR0FBUyxFQUFFLEtBQWEsRUFBRSxXQUFtQixJQUFjLEVBQUUsVUFBZ0IsR0FBVztJQUV4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