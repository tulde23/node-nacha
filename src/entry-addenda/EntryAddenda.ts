import { NumericalString } from '../Types.js';
import achBuilder from '../class/achParser.js';
import nACHError from '../error.js';
import { generateString } from '../utils.js';
import { EntryAddendaFields, EntryAddendaOptions } from './entryAddendaTypes.js';

export default class EntryAddenda extends achBuilder<'EntryAddenda'> {
  fields!: EntryAddendaFields;

  constructor(options: EntryAddendaOptions, autoValidate: boolean = true, debug = false) {
    super({ options, name: 'EntryAddenda', debug });

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
    const { validations } = this;

    // Validate required fields
    validations.validateRequiredFields(this.fields);

    const ACHAddendaTypeCodes = ['02', '05', '98', '99'] as Array<NumericalString>;

    // Validate the ACH code passed is actually valid
    if (this.fields.addendaTypeCode.value.length !== 2 || ACHAddendaTypeCodes.includes(this.fields.addendaTypeCode.value) === false) {
      throw new nACHError({
        name: 'ACH Addenda Type Code Error',
        message: `The ACH addenda type code ${this.fields.addendaTypeCode.value} is invalid. Please pass a valid 2-digit addenda type code.`,
      });
    }

    // Validate header field lengths
    validations.validateLengths(this.fields);

    // Validate header data types
    validations.validateDataTypes(this.fields);
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

module.exports = EntryAddenda;
