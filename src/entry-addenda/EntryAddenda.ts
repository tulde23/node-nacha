import { NumericalString } from '../Types.js';
import achBuilder from '../class/achParser.js';
import { highLevelAddendaFieldOverrides } from '../overrides.js';
import { generateString } from '../utils.js';
import validations from '../validate.js';
import { EntryAddendaFields, EntryAddendaOptions } from './entryAddendaTypes.js';
import { fields } from './fields.js';

export default class EntryAddenda extends achBuilder<'EntryAddenda'> {
  fields: EntryAddendaFields;

  constructor(options: EntryAddendaOptions, autoValidate: boolean = true, debug = false) {
    super({ options, name: 'EntryAddenda', debug });

    this.overrides = highLevelAddendaFieldOverrides;
    this.fields = options.fields
      ? { ...options.fields, ...fields } satisfies EntryAddendaFields
      : fields as EntryAddendaFields;

    const { overrides, typeGuards } = this;

    if ('fields' in this
    && Array.isArray(overrides)
    && typeGuards.isEntryAddendaOverrides(overrides)
    && typeGuards.isEntryAddendaOptions(options)){
    overrides.forEach((field) => {
      if (field in options && options[field] !== undefined) this.set(field, options[field] as NonNullable<typeof options[typeof field]>);
    });
  } else{
    if (this.debug){
      console.debug('[overrideOptions::Failed Because]', {
        fieldsInThis: 'fields' in this,
        overridesIsArray: Array.isArray(overrides),
        isEntryAddendaOverrides: typeGuards.isEntryAddendaOverrides(overrides),
        isEntryAddendaOptions: typeGuards.isEntryAddendaOptions(options),
      })
    }
  }

  

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
      if (field === 'entryDetailSequenceNumber') {
        this.fields.entryDetailSequenceNumber['value'] = value.toString().slice(0 - this.fields[field].width) as NumericalString; // pass last n digits
      } else {
        this.fields[field]['value'] = value;
      }
    }
  }
}

module.exports = EntryAddenda;
