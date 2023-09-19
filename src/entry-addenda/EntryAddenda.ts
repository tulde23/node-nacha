import { NumericalString } from '../Types.js';
import { highLevelAddendaFieldOverrides } from '../overrides.js';
import { generateString } from '../utils.js';
import validations from '../validate.js';
import { EntryAddendaFields, EntryAddendaOptions } from './entryAddendaTypes.js';
import { AddendaFieldDefaults } from './fields.js';

export default class EntryAddenda {
  public fields: EntryAddendaFields;
  public debug: boolean;

  /**
   * @param {EntryAddendaOptions} options
   * @param {boolean} autoValidate - optional / defaults to true
   * @param {boolean} debug - optional / defaults to false
   */
  constructor(options: EntryAddendaOptions, autoValidate: boolean = true, debug: boolean = false) {
    this.debug = debug;

    if (options.fields) {
      this.fields = {...JSON.parse(JSON.stringify(AddendaFieldDefaults)) as Readonly<EntryAddendaFields>, ...options.fields } as EntryAddendaFields;
    } else {
      this.fields = JSON.parse(JSON.stringify(AddendaFieldDefaults)) as Readonly<EntryAddendaFields>;
    }

    highLevelAddendaFieldOverrides.forEach((field) => {
      const overrideValue = options[field];
      if (overrideValue) this.set(field, overrideValue);
    });

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
      this.fields.entryDetailSequenceNumber.value = options.entryDetailSequenceNumber.toString().slice(0 - this.fields.entryDetailSequenceNumber.width) as NumericalString; // last n digits. pass 
    }

    // Validate required fields have been passed
    if (autoValidate) this.validate();
  }

  private validate() {
    const { validateRequiredFields, validateLengths, validateDataTypes, validateACHAddendaTypeCode } = validations(this);

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
    return generateString(this.fields);
  }

  get<Key extends keyof EntryAddendaFields = keyof EntryAddendaFields>(field: Key): this['fields'][Key]['value'] {
    if (this.debug) console.log(`[EntryAddenda:get('${field}')]`, { value: this.fields[field]['value'], field: this.fields[field] });
    return this.fields[field]['value'];
  }

  set<Key extends keyof EntryAddendaFields>(field: Key, value: EntryAddendaFields[Key]['value']) {
    if (this.fields[field]) {
      if (this.debug) console.log(`[EntryAddenda:set('${field}')]`, { value, field: this.fields[field] });
      if (field === 'entryDetailSequenceNumber') {
        this.fields.entryDetailSequenceNumber['value'] = value.toString().slice(0 - this.fields[field].width) as NumericalString; // pass last n digits
      } else {
        this.fields[field]['value'] = value;
      }
    }
  }
}
