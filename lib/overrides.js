"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highLevelControlOverrideSet = exports.highLevelControlOverrides = exports.highLevelHeaderOverrideSet = exports.highLevelHeaderOverrides = exports.highLevelFieldOverrideSet = exports.highLevelFieldOverrides = void 0;
exports.highLevelFieldOverrides = [
    'transactionCode', 'receivingDFI', 'checkDigit', 'DFIAccount', 'amount', 'idNumber', 'individualName', 'discretionaryData', 'addendaId', 'traceNumber'
];
exports.highLevelFieldOverrideSet = new Set(exports.highLevelFieldOverrides);
exports.highLevelHeaderOverrides = [
    'serviceClassCode', 'companyDiscretionaryData', 'companyIdentification', 'standardEntryClassCode'
];
exports.highLevelHeaderOverrideSet = new Set(exports.highLevelHeaderOverrides);
exports.highLevelControlOverrides = ['addendaCount', 'entryHash', 'totalDebit', 'totalCredit'];
exports.highLevelControlOverrideSet = new Set(exports.highLevelControlOverrides);
