import { NumericalString } from '../Types.js';
import EntryAddenda from '../entry-addenda/EntryAddenda.js';
import { highLevelFieldOverrides } from '../overrides.js';
import { addNumericalString, computeCheckDigit, deepMerge, generateString } from '../utils.js';
import validations from '../validate.js';
import { EntryFields, EntryOptions } from './entryTypes.js';
import { EntryFieldDefaults } from './fields.js';

/**
 * @class Entry
 * @description Entry class that will be used to create Entry objects
 * @param {EntryOptions} options - required
 * @param {boolean} autoValidate - optional / defaults to true
 * @param {boolean} debug - optional / defaults to false
 */
export default class Entry {
  public debug: boolean;

  public fields: EntryFields;
  public addendas: Array<EntryAddenda> = [];

  /**
   * @param {EntryOptions} options - required
   * @param {boolean} autoValidate - optional / defaults to true
   * @param {boolean} debug - optional / defaults to false
   * @returns {Entry}
   */
  constructor(options: EntryOptions, autoValidate: boolean = true, debug: boolean = false) {
    this.debug = debug;

    if (options.fields){
      this.fields = deepMerge(EntryFieldDefaults, options.fields) as EntryFields;
    } else {
      this.fields = deepMerge({}, EntryFieldDefaults) as EntryFields;
    }

    highLevelFieldOverrides.forEach((field) => {
      if (field in options){
        const value = options[field];

        if (value) {
          if (field === 'transactionCode'
          || field === 'receivingDFI'
          || field === 'traceNumber'
          || field === 'checkDigit'
          || field === 'DFIAccount'
          || field === 'idNumber'
          || field === 'discretionaryData') {
            this.set(field, value as `${number}`);
          } else if (field === 'amount') {
            this.set(field, Number(value));
          } else {
            this.set(field, value);
          }
        }
      }
    });

    // Some values need special coercing, so after they've been set by overrideLowLevel() we override them
    if (options.receivingDFI) {
      this.fields.receivingDFI.value = computeCheckDigit(options.receivingDFI).slice(0, -1) as NumericalString;
      this.fields.checkDigit.value = computeCheckDigit(options.receivingDFI).slice(-1) as NumericalString;
    }

    if (options.DFIAccount) {
      this.fields.DFIAccount.value = options.DFIAccount.slice(0, this.fields.DFIAccount.width);
    }

    if (options.amount) {
      this.fields.amount.value = Number(options.amount);
    }

    if (options.idNumber) {
      this.fields.idNumber.value = options.idNumber;
    }

    if (options.individualName) {
      this.fields.individualName.value = options.individualName.slice(0, this.fields.individualName.width);
    }

    if (options.discretionaryData) {
      this.fields.discretionaryData.value = options.discretionaryData;
    }

    if (autoValidate !== false) {
      // Validate required fields have been passed
      this._validate();
    }
  }

  addAddenda(entryAddenda: EntryAddenda) {
    const traceNumber = this.get('traceNumber');

    // Add indicator to Entry record
    this.fields.addendaId.value = '1';

    // Set corresponding fields on Addenda
    entryAddenda.set('addendaSequenceNumber', this.addendas.length + 1);
    entryAddenda.set('entryDetailSequenceNumber', traceNumber);

    // Add the new entryAddenda to the addendas array
    this.addendas.push(entryAddenda);

    console.info({
      'Adding -> entryAddenda': entryAddenda.fields['paymentRelatedInformation'],
      'Current -> addendas': this.addendas?.map(({ fields: f }) => f['paymentRelatedInformation']),
    })
  }

  getAddendas() { return this.addendas; }

  getRecordCount() { return this.addendas.length + 1; }

  _validate() {
    try {
      const { validateDataTypes, validateLengths, validateRequiredFields, validateRoutingNumber, validateACHCode } = validations(this);

      // Validate required fields
      validateRequiredFields(this.fields);
    
      // Validate the ACH code passed
      if (this.fields.addendaId.value == '0') {
        validateACHCode(this.fields.transactionCode.value as `${number}`);
      } else {
        if (this.fields.transactionCode.value){
          //  validateACHAddendaCode(this.fields.transactionCode.value);
          //! - this didn't do anything in the base library
        }
      }
    
      // Validate the routing number
      validateRoutingNumber(
        addNumericalString(this.fields.receivingDFI.value, this.fields.checkDigit.value)
      );
    
      // Validate header field lengths
      validateLengths(this.fields);
  
      // Validate header data types
      validateDataTypes(this.fields);
    } catch (error) {
      if (this.debug) console.debug('[Entry::_validate::Error]', error)
      throw error;
    }
  }

  async generateString(){
    const result = [await generateString(this.fields)];

    for await (const addenda of this.addendas) {
      // console.log({ addenda: addenda.fields })
      result.push(await addenda.generateString());
    }

    return result.join('\r\n');
  }

  get<Key extends keyof EntryFields = keyof EntryFields>(field: Key): this['fields'][Key]['value'] {
    return this.fields[field]['value'];
  }

  set<Key extends keyof EntryFields = keyof EntryFields>(field: Key, value: typeof this['fields'][Key]['value']) {
    if (this.fields[field]) this.fields[field]['value'] = value;
  }
}
