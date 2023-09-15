"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    }
}
exports.default = achBuilder;
module.exports = achBuilder;
