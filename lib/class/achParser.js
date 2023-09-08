"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const control_1 = require("../batch/control");
const header_1 = require("../batch/header");
const fields_js_1 = require("../entry-addenda/fields.js");
const fields_js_2 = require("../entry/fields.js");
const overrides_js_1 = require("../overrides.js");
const utils_js_1 = require("../utils.js");
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
    overrideOptions() {
        const { name, overrides, options } = this;
        if (name === 'Batch'
            && ('header' in overrides && 'control' in overrides)
            && ('header' in this && 'control' in this)
            && (0, utils_js_1.isBatchOptions)(options)) {
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
        if (name === 'Entry'
            && 'fields' in this
            && Array.isArray(overrides)
            && (0, utils_js_1.isEntryOverrides)(overrides)
            && (0, utils_js_1.isEntryOptions)(options)) {
            overrides.forEach((field) => {
                if (options[field])
                    this.set(field, options[field]);
            });
            return this;
        }
        if (name === 'EntryAddenda'
            && 'fields' in this
            && Array.isArray(overrides)
            && (0, utils_js_1.isEntryAddendaOverrides)(overrides)
            && (0, utils_js_1.isEntryAddendaOptions)(options)) {
            overrides.forEach((field) => {
                if (field in options && options[field] !== undefined)
                    this.set(field, options[field]);
            });
            return this;
        }
    }
    categoryIsKeyOfEntryAddendaFields(category) {
        return (this.name === 'EntryAddenda' && this.fields !== undefined && category in this.fields);
    }
    categoryIsKeyOfEntryFields(category) {
        return (this.name === 'Entry' && this.fields !== undefined && category in this.fields);
    }
    categoryIsKeyOfHeaders(category) {
        return (this.name === 'Batch' && this.header !== undefined && category in this.header);
    }
    categoryIsKeyOfControls(category) {
        return (this.name === 'Batch' && this.control !== undefined && category in this.control);
    }
    get(field) {
        console.log(field);
    }
    set(field, value) {
        const { name } = this;
        if (!field)
            return;
        const isAHeaderField = (field) => {
            return ('header' in this && this.header !== undefined && Object.keys(this.header).includes(field));
        };
        const isAControlField = (field) => {
            return ('control' in this && this.control !== undefined && Object.keys(this.control).includes(field));
        };
        const isAEntryField = (field) => {
            return ('fields' in this && this.fields !== undefined && Object.keys(this.fields).includes(field));
        };
        const isAEntryAddendaField = (field) => {
            return ('fields' in this && this.fields !== undefined && Object.keys(this.fields).includes(field));
        };
        const controlIsBatchControls = (controls) => {
            return ('control' in this
                && this.control !== undefined
                && (Object.keys(this.control).includes('recordTypeCode')
                    && Object.keys(this.control).includes(Object.keys(controls)[Object.keys(controls).length - 1])));
        };
        const fieldsIsEntryFields = (fields) => {
            return ('fields' in this
                && this.fields !== undefined
                && (Object.keys(this.fields).includes('transactionCode')
                    && Object.keys(this.fields).includes(Object.keys(fields)[Object.keys(fields).length - 1])));
        };
        const fieldsIsEntryAddendaFields = (fields) => {
            return ('fields' in this
                && this.fields !== undefined
                && (Object.keys(this.fields).includes('recordTypeCode')
                    && Object.keys(this.fields).includes(Object.keys(fields)[Object.keys(fields).length - 1])));
        };
        if (name === 'Batch'
            && ('header' in this && 'control' in this)
            && (this.header !== undefined && this.control !== undefined)
            && controlIsBatchControls(this.control)) { // If the header has the field, set the value
            if (isAHeaderField(field) && field in this.header) {
                if (field === 'serviceClassCode') {
                    this.header[field].value = value;
                }
                else {
                    this.header[field].value = value;
                }
            }
            // If the control has the field, set the value
            if (isAControlField(field) && field in this.control) {
                this.control[field].value = value;
            }
            return this;
        }
        if (name === 'Entry'
            && ('fields' in this && this.fields !== undefined)
            && fieldsIsEntryFields(this.fields)
            && isAEntryField(field)) {
            // If the entry has the field, set the value
            this.fields[field].value = value;
            return this;
        }
        if (name === 'EntryAddenda'
            && ('fields' in this && this.fields !== undefined)
            && fieldsIsEntryAddendaFields(this.fields)
            && isAEntryAddendaField(field)) {
            if (field === 'entryDetailSequenceNumber' && value) {
                this.fields.entryDetailSequenceNumber.value = Number(value.toString().slice(0 - this.fields.entryDetailSequenceNumber.width)); // pass last n digits
            }
            else {
                this.fields[field].value = value;
            }
            return this;
        }
    }
}
exports.default = achBuilder;
module.exports = achBuilder;
