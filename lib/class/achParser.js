"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fields_js_1 = require("../entry-addenda/fields.js");
const fields_js_2 = require("../entry/fields.js");
const overrides_js_1 = require("../overrides.js");
const control_1 = require("../batch/control");
const header_1 = require("../batch/header");
class achBuilder {
    constructor({ options, name }) {
        this.name = name;
        this.options = options;
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
    }
    overrideLowLevel() {
    }
    categoryIsFields(category) {
        if (this.name === 'EntryAddenda' && this.fields) {
            return category in this.fields;
        }
        else if (this.name === 'Entry' && this.fields) {
            return category in this.fields;
        }
        return false;
    }
    categoryIsKeyOfHeaders(category) {
        if (this.name === 'Batch' && this.header) {
            return category in this.header;
        }
        return false;
    }
    categoryIsKeyOfControls(category) {
        if (this.name === 'Batch' && this.control) {
            return category in this.control;
        }
        return false;
    }
    set(category, value) {
        console.debug({ category, value });
        // If the header has the field, set the value
        if (this.name === 'EntryAddenda' && this.fields && this.categoryIsFields(category)) {
            this.fields[category].value = value;
        }
        else if (this.name === 'Entry' && this.fields && this.categoryIsFields(category)) {
            this.fields[category].value = value;
        }
        else if (this.name === 'Batch') {
            if (this.header && this.categoryIsKeyOfHeaders(category)) {
                this.header[category].value = value;
            }
            else if (this.control && this.categoryIsKeyOfControls(category)) {
                this.control[category].value = value;
            }
        }
    }
}
exports.default = achBuilder;
module.exports = achBuilder;
