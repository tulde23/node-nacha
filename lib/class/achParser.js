"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const control_1 = require("../batch/control");
const header_1 = require("../batch/header");
const fields_js_1 = require("../entry-addenda/fields.js");
const fields_js_2 = require("../entry/fields.js");
const control_js_1 = require("../file/control.js");
const header_js_1 = require("../file/header.js");
const overrides_js_1 = require("../overrides.js");
const utils_js_1 = require("../utils.js");
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
    }
    get(field) {
        console.log(field);
    }
}
exports.default = achBuilder;
module.exports = achBuilder;
