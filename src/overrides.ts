import type { HighLevelHeaderOverrides, HighLevelControlOverrides } from './batch/batchTypes.js';
import type { HighLevelFieldOverrides } from './entry/entryTypes.js';

export const highLevelFieldOverrides: Array<HighLevelFieldOverrides> = [
  'transactionCode', 'receivingDFI', 'checkDigit', 'DFIAccount', 'amount', 'idNumber', 'individualName', 'discretionaryData', 'addendaId', 'traceNumber'
];

export const highLevelFieldOverrideSet = new Set(highLevelFieldOverrides);

export const highLevelHeaderOverrides: Array<HighLevelHeaderOverrides> = [
  'serviceClassCode', 'companyDiscretionaryData', 'companyIdentification', 'standardEntryClassCode'
];

export const highLevelHeaderOverrideSet = new Set(highLevelHeaderOverrides);

export const highLevelControlOverrides: Array<HighLevelControlOverrides> = ['addendaCount', 'entryHash', 'totalDebit', 'totalCredit'];

export const highLevelControlOverrideSet = new Set(highLevelControlOverrides);


