// Entry

import _ from 'lodash';
import async from 'async';
import { computeCheckDigit } from './../utils';
import {
  validateRoutingNumber,
  validateRequiredFields,
  validateLengths,
  validateDataTypes,
  validateACHCode,
  validateACHAddendaCode
} from './../validate';
import { fields } from './fields.js';
import { EntryFields, EntryOptions, HighLevelFieldOverrides } from '../Types.js';

const highLevelOverrides: Array<HighLevelFieldOverrides> = ['transactionCode', 'receivingDFI', 'checkDigit', 'DFIAccount', 'amount', 'idNumber', 'individualName', 'discretionaryData', 'addendaId', 'traceNumber'];

export class Entry {
  _addendas = [];
  fields: EntryFields

  constructor(options: EntryOptions, autoValidate: boolean) {
    // Allow the file header defaults to be override if provided
    this.fields = options.fields
      ? {...options.fields, ...fields } as unknown as EntryFields
      : {...fields };

    // Set our high-level values
    overrideLowLevel(highLevelOverrides, options, this);

    // Some values need special coercing, so after they've been set by overrideLowLevel() we override them
    if (options.receivingDFI) {
      this.fields.receivingDFI.value = computeCheckDigit(options.receivingDFI).slice(0, -1);
      this.fields.checkDigit.value = computeCheckDigit(options.receivingDFI).slice(-1);
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

    // Add indicator to Entry record
    this.set('addendaId', '1');
  
    // Set corresponding feilds on Addenda
    entryAddenda.set('addendaSequenceNumber', this._addendas.length + 1);
    entryAddenda.set('entryDetailSequenceNumber', this.get('traceNumber'));
  
    // Add the new entryAddenda to the addendas array
    this._addendas.push(entryAddenda);
  }

  getAddendas() { return this._addendas; }

  getRecordCount() { return this._addendas.length + 1; }

  generateString(cb: { (string: string): void; (arg0: string): void; }) {
    const self = this;
    async.map(self._addendas, function(entryAddenda: { fields: any; }, done: (arg0: null, arg1: any) => void) {
      generateString(entryAddenda.fields, function(string: any) {
        done(null, string);
      });
    }, function(err: any, addendaStrings: any) {
      generateString(self.fields, function(string: any) {
        cb([string].concat(addendaStrings).join('\n'));
      });
    });
  }

  _validate() {
    // Validate required fields
    validateRequiredFields(this.fields);
  
    // Validate the ACH code passed is actually valid
    if (this.fields.addendaId.value == '0') {
      validateACHCode(this.fields.transactionCode.value);
    } else {
      validateACHAddendaCode(this.fields.transactionCode.value);
    }
  
    // Validate the routing number
    validateRoutingNumber(this.fields.receivingDFI.value + this.fields.checkDigit.value);
  
    // Validate header field lengths
    validateLengths(this.fields);
  
    // Validate header data types
    validateDataTypes(this.fields);
  }

  get(category: string) {
    // If the header has it, return that (header takes priority)
    if (this.fields[category]) {
      return this.fields[category]['value'];
    }
  }

  set(category: string, value: string) {
    // If the header has the field, set the value
    if (this.fields[category]) {
      this.fields[category]['value'] = value;
    }
  }
}

module.exports = Entry;
