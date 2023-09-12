import type { HighLevelHeaderOverrides, HighLevelControlOverrides } from './batch/batchTypes.js';
import type { HighLevelAddendaFieldOverrides } from './entry-addenda/entryAddendaTypes.js';
import type { HighLevelFieldOverrides } from './entry/entryTypes.js';
import { HighLevelFileOverrides } from './file/FileTypes.js';

// Entry Addenda Overrides
export const highLevelAddendaFieldOverrides: Array<HighLevelAddendaFieldOverrides> = [
  'addendaTypeCode', 'paymentRelatedInformation', 'addendaSequenceNumber', 'entryDetailSequenceNumber'
];
export const highLevelAddendaFieldOverrideSet = new Set(highLevelAddendaFieldOverrides);

// Entry Overrides
export const highLevelFieldOverrides: Array<HighLevelFieldOverrides> = [
  'transactionCode', 'receivingDFI', 'checkDigit', 'DFIAccount', 'amount', 'idNumber', 'individualName', 'discretionaryData', 'addendaId', 'traceNumber'
];
export const highLevelFieldOverrideSet = new Set(highLevelFieldOverrides);

// Batch Header Overrides
export const highLevelHeaderOverrides: Array<HighLevelHeaderOverrides> = [
  'serviceClassCode', 'companyDiscretionaryData', 'companyIdentification', 'standardEntryClassCode'
];
export const highLevelHeaderOverrideSet = new Set(highLevelHeaderOverrides);

// Batch Control Overrides
export const highLevelControlOverrides: Array<HighLevelControlOverrides> = ['addendaCount', 'entryHash', 'totalDebit', 'totalCredit'];
export const highLevelControlOverrideSet = new Set(highLevelControlOverrides);

// File Header
export const highLevelFileOverrides: Array<HighLevelFileOverrides> = [
  'immediateDestination', 'immediateOrigin', 'fileCreationDate', 'fileCreationTime', 'fileIdModifier', 'immediateDestinationName', 'immediateOriginName', 'referenceCode'
];
export const highLevelFileOverrideSet = new Set(highLevelFileOverrides);

