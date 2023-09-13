import { EntryFields } from './entryTypes.js';

export const fields: EntryFields = {
  recordTypeCode: {
    name: 'Record Type Code',
    width: 1,
    position: 1,
    required: true,
    type: 'numeric',
    value: '6'
  },

  transactionCode: {
    name: 'Transaction Code',
    width: 2,
    position: 2,
    required: true,
    type: 'numeric'
  },

  receivingDFI: {
    name: 'Receiving DFI Identification' as 'Receiving D F I',
    width: 8,
    position: 3,
    required: true,
    type: 'numeric',
    value: '' as `${number}`
  },

  checkDigit: {
    name: 'Check Digit',
    width: 1,
    position: 4,
    required: true,
    type: 'numeric',
    value: '' as `${number}`
  },

  DFIAccount: {
    name: 'DFI Account Number' as ' D F I Account',
    width: 17,
    position: 5,
    required: true,
    type: 'alphanumeric',
    value: ''
  },

  amount: {
    name: 'Amount',
    width: 10,
    position: 6,
    required: true,
    type: 'numeric',
    value: '',
    number: true
  },

  idNumber: {
    name: 'Individual Identification Number' as 'Id Number',
    width: 15,
    position: 7,
    required: false,
    type: 'alphanumeric',
    value: ''
  },

  individualName: {
    name: 'Individual Name',
    width: 22,
    position: 8,
    required: true,
    type: 'alphanumeric',
    value: ''
  },

  discretionaryData: {
    name: 'Discretionary Data',
    width: 2,
    position: 9,
    required: false,
    type: 'alphanumeric',
    value: '',
  },

  addendaId: {
    name: 'Addenda Record Indicator' as 'Addenda Id',
    width: 1,
    position: 10,
    required: true,
    type: 'numeric',
    value: '0'
  },

  traceNumber: {
    name: 'Trace Number',
    width: 15,
    position: 11,
    required: false,
    type: 'numeric',
    blank: true,
    value: '' as `${number}`
  }
};

module.exports = { fields }
