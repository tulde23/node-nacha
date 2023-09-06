"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highLevelControlOverrideSet = exports.highLevelControlOverrides = exports.highLevelHeaderOverrideSet = exports.highLevelHeaderOverrides = exports.highLevelFieldOverrideSet = exports.highLevelFieldOverrides = exports.highLevelAddendaFieldOverrideSet = exports.highLevelAddendaFieldOverrides = void 0;
// Entry Addenda Overrides
exports.highLevelAddendaFieldOverrides = [
    'addendaTypeCode', 'paymentRelatedInformation', 'addendaSequenceNumber', 'entryDetailSequenceNumber'
];
exports.highLevelAddendaFieldOverrideSet = new Set(exports.highLevelAddendaFieldOverrides);
// Entry Overrides
exports.highLevelFieldOverrides = [
    'transactionCode', 'receivingDFI', 'checkDigit', 'DFIAccount', 'amount', 'idNumber', 'individualName', 'discretionaryData', 'addendaId', 'traceNumber'
];
exports.highLevelFieldOverrideSet = new Set(exports.highLevelFieldOverrides);
// Batch Header Overrides
exports.highLevelHeaderOverrides = [
    'serviceClassCode', 'companyDiscretionaryData', 'companyIdentification', 'standardEntryClassCode'
];
exports.highLevelHeaderOverrideSet = new Set(exports.highLevelHeaderOverrides);
// Batch Control Overrides
exports.highLevelControlOverrides = ['addendaCount', 'entryHash', 'totalDebit', 'totalCredit'];
exports.highLevelControlOverrideSet = new Set(exports.highLevelControlOverrides);
