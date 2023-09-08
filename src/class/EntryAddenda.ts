import { EntryAddendaFieldKeys, EntryAddendaFields, EntryAddendaOptions } from '../entry-addenda/entryAddendaTypes.js';
import { pad } from '../utils.js';
import { validateRequiredFields, validateACHAddendaTypeCode, validateLengths, validateDataTypes } from '../validate.js';
import achBuilder from './achParser.js';

export default class EntryAddenda extends achBuilder<'EntryAddenda'> {
  fields!: EntryAddendaFields;

  constructor(options: EntryAddendaOptions, autoValidate: boolean = true) {
    super({ options, name: 'EntryAddenda' });

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

    // Validate required fields have been passed
    if (autoValidate) this.validate();
  }

  private validate() {
    // Validate required fields
    validateRequiredFields(this.fields);

    // Validate the ACH code passed is actually valid
    validateACHAddendaTypeCode(this.fields.addendaTypeCode.value);

    // Validate header field lengths
    validateLengths(this.fields);

    // Validate header data types
    validateDataTypes(this.fields);
  }

  getReturnCode() {
    if (this.fields.paymentRelatedInformation.value || this.fields.paymentRelatedInformation.value.length > 0) {
      return this.fields.paymentRelatedInformation.value.slice(0, 3);
    }
    return false;
  }

  generateString(){
    let result = '';

    Object.keys(this.fields).forEach((key) => {
      const field = this.fields[key as EntryAddendaFieldKeys];
  
      if (!field.position) return;

      if (('blank' in field && field.blank === true) || field.type === 'alphanumeric') {
        result += pad(field.value, field.width);
        return;
      }

      const string = ('number' in field && field.number === true)
        ? Number(field.value).toFixed(2)
        : field.value;

      const paddingChar = field.paddingChar ?? '0';

      result += pad(string, field.width, false, paddingChar);
    });

    return result;
  }

  get<Key extends keyof EntryAddendaFields = keyof EntryAddendaFields>(field: Key): this['fields'][Key]['value'] {
    return this.fields[field]['value'];
  }
}

module.exports = EntryAddenda;
