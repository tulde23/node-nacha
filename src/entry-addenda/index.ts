// Entry

import { generateString, overrideLowLevel } from '../utils.js';
import { highLevelAddendaFieldOverrides } from '../overrides.js';
import { EntryAddendaFields, EntryAddendaOptions } from './entryAddendaTypes.js';
import { fields } from './fields.js';
import { validateRequiredFields, validateACHAddendaTypeCode, validateLengths, validateDataTypes } from '../validate.js';

export default class EntryAddenda {
  fields: EntryAddendaFields

  constructor(options: EntryAddendaOptions, autoValidate: boolean) {
    // Allow the file header defaults to be override if provided
    this.fields = (options.fields)
      ? { ...options.fields, ...fields } as EntryAddendaFields
      : fields as EntryAddendaFields;

    // Set our high-level values
    overrideLowLevel(highLevelAddendaFieldOverrides, options, this);

    // Some values need special coercing, so after they've been set by overrideLowLevel() we override them
    if (options.returnCode) {
      this.fields.returnCode.value = options.returnCode.slice(0, this.fields.returnCode.width) as `${number}`;
    }
    
    if (options.paymentRelatedInformation) {
      this.fields.paymentRelatedInformation.value = options.paymentRelatedInformation.slice(0, this.fields.paymentRelatedInformation.width);
    }

    if (options.addendaSequenceNumber) {
      this.fields.addendaSequenceNumber.value = options.addendaSequenceNumber;
    }

    if (options.entryDetailSequenceNumber) {
      this.fields.entryDetailSequenceNumber.value = Number(options.entryDetailSequenceNumber.toString().slice(0 - this.fields.entryDetailSequenceNumber.width)); // last n digits. pass 
    }

    if (autoValidate !== false) {
      // Validate required fields have been passed
      this._validate();
    }
  }

  _validate() {
    // Validate required fields
    validateRequiredFields(this.fields);

    // Validate the ACH code passed is actually valid
    validateACHAddendaTypeCode(this.fields.addendaTypeCode.value);

    // Validate header field lengths
    validateLengths(this.fields);

    // Validate header data types
    validateDataTypes(this.fields);
  }

  generateString(cb: (string: string) => void) {
    generateString(this.fields, function(string) {
      cb(string);
    });
  }

  getReturnCode() {
    if (this.fields.paymentRelatedInformation.value || this.fields.paymentRelatedInformation.value.length > 0) {
      return this.fields.paymentRelatedInformation.value.slice(0, 3);
    }
    return false;
  }

  get<Field extends keyof EntryAddendaFields>(field: Field): EntryAddendaFields[Field]['value'] {
    return this.fields[field]['value'];
  }

  set<Field extends keyof EntryAddendaFields>(field: Field, value: EntryAddendaFields[Field]['value']) {
    if (this.fields[field]) {
      if (field === 'entryDetailSequenceNumber') {
        this.fields.entryDetailSequenceNumber['value'] = Number(value.toString().slice(0 - this.fields[field].width)); // pass last n digits
      } else {
        this.fields[field]['value'] = value;
      }
    }
  }
}

module.exports = EntryAddenda;
