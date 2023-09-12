"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const control_1 = require("../batch/control");
const header_1 = require("../batch/header");
const fields_js_1 = require("../entry-addenda/fields.js");
const fields_js_2 = require("../entry/fields.js");
const error_js_1 = __importDefault(require("../error.js"));
const control_js_1 = require("../file/control.js");
const header_js_1 = require("../file/header.js");
const overrides_js_1 = require("../overrides.js");
const utils_js_1 = require("../utils.js");
const numericRegex = /^[0-9]+$/;
const alphaRegex = /^[a-zA-Z]+$/;
// eslint-disable-next-line no-useless-escape
const alphanumericRegex = /(^[0-9a-zA-Z!"#$%&'()*+,-.\/:;<>=?@\[\]\\^_`{}|~ ]+$)|(^$)/;
class achBuilder {
    constructor({ options, name, debug }) {
        this.debug = false;
        this.typeGuards = {
            isEntryOptions: (arg) => {
                if (typeof arg !== 'object') {
                    if (this.debug)
                        console.debug('isEntryOptions() failed because arg is not an object');
                    return false;
                }
                if (Object.keys(arg).length === 0) {
                    if (this.debug)
                        console.debug('isEntryOptions() failed because arg has no keys');
                    return false;
                }
                if ('amount' in arg)
                    return true;
                if (this.debug)
                    console.debug('isEntryOptions() failed because arg has no amount key', { arg });
                return false;
            },
            isEntryAddendaOptions(arg) {
                if (typeof arg !== 'object')
                    return false;
                if (Object.keys(arg).length === 0)
                    return false;
                if ('paymentRelatedInformation' in arg)
                    return true;
                return false;
            },
            isBatchOptions(arg) {
                if (typeof arg !== 'object')
                    return false;
                if (Object.keys(arg).length === 0)
                    return false;
                if ('originatingDFI' in arg)
                    return true;
                return false;
            },
            isFileOptions(arg) {
                if (typeof arg !== 'object')
                    return false;
                if (Object.keys(arg).length === 0)
                    return false;
                if ('immediateDestination' in arg)
                    return true;
                return false;
            },
            isEntryOverrides(arg) {
                if (!Array.isArray(arg))
                    return false;
                if (arg.length === 0)
                    return false;
                return (0, utils_js_1.compareSets)(new Set(arg), overrides_js_1.highLevelFieldOverrideSet);
            },
            isEntryAddendaOverrides(arg) {
                if (!Array.isArray(arg))
                    return false;
                if (arg.length === 0)
                    return false;
                return (0, utils_js_1.compareSets)(new Set(arg), overrides_js_1.highLevelAddendaFieldOverrideSet);
            },
            isFileOverrides(arg) {
                if (!Array.isArray(arg))
                    return false;
                if (arg.length === 0)
                    return false;
                return (0, utils_js_1.compareSets)(new Set(arg), overrides_js_1.highLevelFileOverrideSet);
            }
        };
        this.validations = {
            validateRequiredFields: (object) => {
                Object.keys(object).forEach((k) => {
                    const field = object[k];
                    // This check ensures a required field's value is not NaN, null, undefined or empty.
                    // Zero is valid, but the data type check will make sure any fields with 0 are numeric.
                    if (('required' in field && typeof field.required === 'boolean' && field.required === true)
                        && (('value' in field === false) || (!field.value) || field.value.toString().length === 0)) {
                        if (this.debug) {
                            console.debug('[validateRequiredFields::Failed Because]', {
                                name: field.name,
                                value: field.value,
                                required: field.required,
                                length: (field.value) ? field.value.toString().length : undefined,
                            });
                        }
                        throw new error_js_1.default({
                            name: 'Required Field Blank',
                            message: `${field.name} is a required field but its value is: ${field.value}`
                        });
                    }
                });
                return true;
            },
            validateRoutingNumber(routing) {
                if (typeof routing === 'number')
                    routing = routing.toString();
                // Make sure the routing number is exactly 9-digits long
                if (routing.length !== 9) {
                    throw new error_js_1.default({
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
                    throw new error_js_1.default({
                        name: 'Invalid ABA Number',
                        message: `The ABA routing number ${routing} is invalid. Please ensure a valid 9-digit ABA routing number is passed.`,
                    });
                }
                return true;
            },
            validateLengths: (object) => {
                Object.keys(object).forEach((k) => {
                    const field = object[k];
                    if (field.value.toString().length > field.width) {
                        throw new error_js_1.default({
                            name: 'Invalid Length',
                            message: `${field.name}'s length is ${typeof field.value === 'number' ? field.value.toString().length : field.value.length}, but it should be no greater than ${field.width}.`
                        });
                    }
                });
                return true;
            },
            validateDataTypes(object) {
                Object.keys(object).forEach((k) => {
                    const field = object[k];
                    if ('blank' in field && field.blank !== true) {
                        switch (field.type) {
                            case 'numeric': {
                                (0, utils_js_1.testRegex)(numericRegex, field);
                                break;
                            }
                            case 'alpha': {
                                (0, utils_js_1.testRegex)(alphaRegex, field);
                                break;
                            }
                            case 'alphanumeric': {
                                (0, utils_js_1.testRegex)(alphanumericRegex, field);
                                break;
                            }
                            default: {
                                throw new error_js_1.default({
                                    name: 'Invalid Data Type',
                                    message: `${field.name}'s data type is required to be ${field.type}, but its contents don't reflect that.`
                                });
                            }
                        }
                    }
                });
                return true;
            }
        };
        this.name = name;
        this.options = options;
        this.debug = debug || false;
        if (this.name === 'EntryAddenda') {
            this.overrides = overrides_js_1.highLevelAddendaFieldOverrides;
            this.fields = (options.fields)
                ? Object.assign(Object.assign({}, options.fields), fields_js_1.fields)
                : fields_js_1.fields;
        }
        else if (this.name === 'Entry') {
            this.overrides = overrides_js_1.highLevelFieldOverrides;
            this.fields = (options.fields)
                ? Object.assign(Object.assign({}, options.fields), fields_js_2.fields)
                : fields_js_2.fields;
        }
        else if (this.name === 'Batch') {
            this.overrides = { header: overrides_js_1.highLevelHeaderOverrides, control: overrides_js_1.highLevelControlOverrides };
            // Allow the batch header/control defaults to be override if provided
            this.header = (options.header)
                ? Object.assign(Object.assign({}, options.header), header_1.header)
                : Object.assign({}, header_1.header);
            this.control = (options.control)
                ? Object.assign(Object.assign({}, options.control), control_1.control)
                : Object.assign({}, control_1.control);
        }
        else if (this.name === 'File') {
            this.overrides = overrides_js_1.highLevelFileOverrides;
            this.header = (options.header)
                ? Object.assign(Object.assign({}, options.header), header_js_1.fileHeaders)
                : Object.assign({}, header_1.header);
            this.control = (options.control)
                ? Object.assign(Object.assign({}, options.control), control_js_1.fileControls)
                : Object.assign({}, control_1.control);
        }
        this.overrideOptions();
    }
    overrideOptions() {
        const { name, overrides, options, typeGuards } = this;
        if (name === 'File') {
            if (('header' in this && 'control' in this)
                && typeGuards.isFileOverrides(overrides)
                && typeGuards.isFileOptions(options)) {
                overrides.forEach((field) => {
                    if (options[field])
                        this.set(field, options[field]);
                });
                return this;
            }
        }
        if (name === 'Batch') {
            if (('header' in overrides && 'control' in overrides)
                && ('header' in this && 'control' in this)
                && typeGuards.isBatchOptions(options)) {
                overrides.header.forEach((field) => {
                    if (options[field])
                        this.set(field, options[field]);
                });
                overrides.control.forEach((field) => {
                    if (options[field])
                        this.set(field, options[field]);
                });
                return this;
            }
            if (this.debug) {
                console.debug('[overrideOptions::Failed Because]', {
                    name,
                    headerInOverrides: 'header' in overrides,
                    controlInOverrides: 'control' in overrides,
                    headerInThis: 'header' in this,
                    controlInThis: 'control' in this,
                    isBatchOptions: typeGuards.isBatchOptions(options),
                });
            }
        }
        if (name === 'Entry') {
            if ('fields' in this
                && Array.isArray(overrides)
                && typeGuards.isEntryOverrides(overrides)
                && typeGuards.isEntryOptions(options)) {
                overrides.forEach((field) => {
                    if (options[field])
                        this.set(field, options[field]);
                });
                return this;
            }
            if (this.debug) {
                console.debug('[overrideOptions::Failed Because]', {
                    name,
                    fieldsInThis: 'fields' in this,
                    overridesIsArray: Array.isArray(overrides),
                    isEntryOverrides: typeGuards.isEntryOverrides(overrides),
                    isEntryOptions: typeGuards.isEntryOptions(options),
                });
            }
        }
        if (name === 'EntryAddenda') {
            if ('fields' in this
                && Array.isArray(overrides)
                && typeGuards.isEntryAddendaOverrides(overrides)
                && typeGuards.isEntryAddendaOptions(options)) {
                overrides.forEach((field) => {
                    if (field in options && options[field] !== undefined)
                        this.set(field, options[field]);
                });
                return this;
            }
            if (this.debug) {
                console.debug('[overrideOptions::Failed Because]', {
                    name,
                    fieldsInThis: 'fields' in this,
                    overridesIsArray: Array.isArray(overrides),
                    isEntryAddendaOverrides: typeGuards.isEntryAddendaOverrides(overrides),
                    isEntryAddendaOptions: typeGuards.isEntryAddendaOptions(options),
                });
            }
        }
    }
    get(field) {
        console.log(field);
    }
    set(field, value) {
        if (!field)
            return;
        console.log(field, value);
    }
}
exports.default = achBuilder;
module.exports = achBuilder;
