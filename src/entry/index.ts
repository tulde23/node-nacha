import { computeCheckDigit, generateString, overrideLowLevel } from './../utils';
import {
  validateRoutingNumber,
  validateRequiredFields,
  validateLengths,
  validateDataTypes,
  validateACHCode,
  validateACHAddendaCode
} from './../validate';
import { fields } from './fields.js';
import type { EntryFields, EntryOptions } from './entryTypes.js';
import { highLevelFieldOverrides } from '../overrides.js';
import nACHError from '../error.js';
export default class Entry {
  _addendas = [];
  fields: EntryFields

  constructor(options: EntryOptions, autoValidate: boolean) {
    // Allow the file header defaults to be override if provided
    this.fields = options.fields
      ? {...options.fields, ...fields } as unknown as EntryFields
      : {...fields };

    // Set our high-level values
    overrideLowLevel(highLevelFieldOverrides, options, this);

    // Some values need special coercing, so after they've been set by overrideLowLevel() we override them
    if (options.receivingDFI) {
      this.fields.receivingDFI.value = computeCheckDigit(options.receivingDFI).slice(0, -1) as `${number}`;
      this.fields.checkDigit.value = computeCheckDigit(options.receivingDFI).slice(-1) as `${number}`;
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

  addAddenda(entryAddenda: { set: (arg0: string, arg1: number) => void; }) {

    const traceNumber = this.get('traceNumber');

    // Add indicator to Entry record
    this.set('addendaId', '1');
  
    // Set corresponding fields on Addenda
    entryAddenda.set('addendaSequenceNumber', this._addendas.length + 1);
    if (typeof traceNumber === 'number'){
      entryAddenda.set('entryDetailSequenceNumber', traceNumber);
    } else {
      entryAddenda.set('entryDetailSequenceNumber', Number(traceNumber));
    }
  
    // Add the new entryAddenda to the addendas array
    this._addendas.push(entryAddenda);
  }

  getAddendas() { return this._addendas; }

  getRecordCount() { return this._addendas.length + 1; }

  generateString(cb) {
    try {
      this._addendas.map((({ fields }) => {
        generateString(fields, function(string) { done(null, string); });
      }));
    } catch (error) {
      generateString(this.fields, function(string) {
        cb([string].concat(addendaStrings).join('\n'));
      });
    }
  }

  _validate() {
    // Validate required fields
    validateRequiredFields(this.fields);
  
    // Validate the ACH code passed
    if (this.fields.addendaId.value == '0') {
      if (this.fields.transactionCode.value){
        validateACHCode(this.fields.transactionCode.value);
      } else {
        throw new nACHError({
          name: 'ACH Transaction Code Error',
          message: `The ACH transaction code must be provided when addenda ID === '0'. Please pass a valid 2-digit transaction code.`
        });
      }
    } else {
      if (this.fields.transactionCode.value){
        validateACHAddendaCode(this.fields.transactionCode.value);
      }
    }
  
    // Validate the routing number
    validateRoutingNumber(Number(this.fields.receivingDFI.value) + Number(this.fields.checkDigit.value));
  
    // Validate header field lengths
    validateLengths(this.fields);
  
    // Validate header data types
    validateDataTypes(this.fields);
  }

  get<Field extends keyof typeof fields = keyof typeof fields>(category: Field): typeof fields[Field]['value'] {
    // If the header has it, return that (header takes priority)
    if (this.fields[category]) return this.fields[category].value;
  }

  set<Field extends keyof typeof fields = keyof typeof fields>(category: Field, value: string) {
    // If the header has the field, set the value
    if (this.fields[category]) this.fields[category]['value'] = value;
  }
}

module.exports = Entry;
