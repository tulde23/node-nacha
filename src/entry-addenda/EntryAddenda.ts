import { NumericalString } from '../Types.js';
import { highLevelAddendaFieldOverrides } from '../overrides.js';
import { generateString } from '../utils.js';
import validations from '../validate.js';
import { EntryAddendaFields, EntryAddendaOptions, HighLevelAddendaFieldOverrides } from './entryAddendaTypes.js';
import { fields as AddendaDefaultFields } from './fields.js';

export default class EntryAddenda {
  public overrides = highLevelAddendaFieldOverrides;
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
      this.fields = { ...AddendaDefaultFields, ...options.fields };
    } else {
      this.fields = { ...AddendaDefaultFields } as EntryAddendaFields;
    }

    this.overrides.forEach((field) => {
      if (options[field]) this.set(field, options[field] as NonNullable<typeof options[typeof field]>);
    });

    // Some values need special coercing, so after they've been set by overrideLowLevel() we override them
    if (options.returnCode) {
      // console.info('[Addenda constructor]', { returnCode: options.returnCode })
      this.fields.returnCode.value = options.returnCode.slice(0, this.fields.returnCode.width) as `${number}`;
    }
    
    if (options.paymentRelatedInformation) {
      // console.info('[Addenda constructor]', { paymentRelatedInformation: options.paymentRelatedInformation })
      this.fields.paymentRelatedInformation.value = options.paymentRelatedInformation.slice(0, this.fields.paymentRelatedInformation.width);
    }

    if (options.addendaSequenceNumber) {
      // console.info('[Addenda constructor]', { addendaSequenceNumber: options.addendaSequenceNumber })
      this.fields.addendaSequenceNumber.value = options.addendaSequenceNumber;
    }

    if (options.entryDetailSequenceNumber) {
      // console.info('[Addenda constructor]', { entryDetailSequenceNumber: options.entryDetailSequenceNumber })
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
      if (field === 'entryDetailSequenceNumber') {
        this.fields.entryDetailSequenceNumber['value'] = value.toString().slice(0 - this.fields[field].width) as NumericalString; // pass last n digits
      } else {
        this.fields[field]['value'] = value;
      }
    }
  }
}
