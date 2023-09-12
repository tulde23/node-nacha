import { NumericalString } from '../Types.js';
import achBuilder from '../class/achParser.js';
import EntryAddenda from '../entry-addenda/EntryAddenda.js';
import nACHError from '../error.js';
import { addNumericalString, computeCheckDigit, generateString } from '../utils.js';
import { EntryFields, EntryOptions } from './entryTypes.js';

const ACHTransactionCodes = ['22', '23', '24', '27', '28', '29', '32', '33', '34', '37', '38', '39'] as Array<NumericalString>;

export default class Entry extends achBuilder<'Entry'>{
  fields!: EntryFields;
  _addendas: Array<EntryAddenda> = [];

  constructor(options: EntryOptions, autoValidate = true, debug = false) {
    super({ options: options, name: 'Entry', debug });

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
    console.info({ traceNumber})

    // Add indicator to Entry record
    this.set('addendaId', '1');
  
    // Set corresponding fields on Addenda
    entryAddenda.set('addendaSequenceNumber', this._addendas.length + 1);
    entryAddenda.set('entryDetailSequenceNumber', traceNumber);
  
    // Add the new entryAddenda to the addendas array
    this._addendas.push(entryAddenda);
  }

  getAddendas() { return this._addendas; }

  getRecordCount() { return this._addendas.length + 1; }

  _validate() {
    const { validations } = this;

    // Validate required fields
    validations.validateRequiredFields(this.fields);
  
    // Validate the ACH code passed
    if (this.fields.addendaId.value == '0') {
      if (this.fields.transactionCode.value){
        if (this.fields.transactionCode.value.length !== 2 || ACHTransactionCodes.includes(this.fields.transactionCode.value) === false) {
          throw new nACHError({
            name: 'ACH Transaction Code Error',
            message: `The ACH transaction code ${this.fields.transactionCode.value} is invalid. Please pass a valid 2-digit transaction code.`
          });
        }
      } else {
        throw new nACHError({
          name: 'ACH Transaction Code Error',
          message: `The ACH transaction code must be provided when addenda ID === '0'. Please pass a valid 2-digit transaction code.`
        });
      }
    } else {
      if (this.fields.transactionCode.value){
        //  validateACHAddendaCode(this.fields.transactionCode.value);
        //! - this didn't do anything in the base library
      }
    }
  
    // Validate the routing number
    validations.validateRoutingNumber(
      addNumericalString(this.fields.receivingDFI.value, this.fields.checkDigit.value)
    );
  
    // Validate header field lengths
    validations.validateLengths(this.fields);

    // Validate header data types
    validations.validateDataTypes(this.fields);
  }

  generateString(){
    const result = generateString(this.fields);

    return [
      result,
      this._addendas.map(((addenda) => addenda.generateString())).join('\n')
    ].join('\n');
  }

  get<Key extends keyof EntryFields = keyof EntryFields>(field: Key): this['fields'][Key]['value'] {
    return this.fields[field]['value'];
  }

  set<Key extends keyof EntryFields = keyof EntryFields>(field: Key, value: this['fields'][Key]['value']) {
    if (this.fields[field]) this.fields[field]['value'] = value;
  }
}
module.exports = Entry;
