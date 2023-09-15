"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.highLevelFileOverrideSet = exports.highLevelFileOverrides = exports.highLevelControlOverrideSet = exports.highLevelControlOverrides = exports.highLevelHeaderOverrideSet = exports.highLevelHeaderOverrides = exports.highLevelFieldOverrideSet = exports.highLevelFieldOverrides = exports.highLevelAddendaFieldOverrideSet = exports.highLevelAddendaFieldOverrides = void 0;
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
// File Header
exports.highLevelFileOverrides = [
    'immediateDestination', 'immediateOrigin', 'fileCreationDate', 'fileCreationTime', 'fileIdModifier', 'immediateDestinationName', 'immediateOriginName', 'referenceCode'
];
exports.highLevelFileOverrideSet = new Set(exports.highLevelFileOverrides);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcnJpZGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL292ZXJyaWRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFLQSwwQkFBMEI7QUFDYixRQUFBLDhCQUE4QixHQUEwQztJQUNuRixpQkFBaUIsRUFBRSwyQkFBMkIsRUFBRSx1QkFBdUIsRUFBRSwyQkFBMkI7Q0FDckcsQ0FBQztBQUNXLFFBQUEsZ0NBQWdDLEdBQUcsSUFBSSxHQUFHLENBQUMsc0NBQThCLENBQUMsQ0FBQztBQUV4RixrQkFBa0I7QUFDTCxRQUFBLHVCQUF1QixHQUFtQztJQUNyRSxpQkFBaUIsRUFBRSxjQUFjLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxhQUFhO0NBQ3ZKLENBQUM7QUFDVyxRQUFBLHlCQUF5QixHQUFHLElBQUksR0FBRyxDQUFDLCtCQUF1QixDQUFDLENBQUM7QUFFMUUseUJBQXlCO0FBQ1osUUFBQSx3QkFBd0IsR0FBb0M7SUFDdkUsa0JBQWtCLEVBQUUsMEJBQTBCLEVBQUUsdUJBQXVCLEVBQUUsd0JBQXdCO0NBQ2xHLENBQUM7QUFDVyxRQUFBLDBCQUEwQixHQUFHLElBQUksR0FBRyxDQUFDLGdDQUF3QixDQUFDLENBQUM7QUFFNUUsMEJBQTBCO0FBQ2IsUUFBQSx5QkFBeUIsR0FBcUMsQ0FBQyxjQUFjLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN6SCxRQUFBLDJCQUEyQixHQUFHLElBQUksR0FBRyxDQUFDLGlDQUF5QixDQUFDLENBQUM7QUFFOUUsY0FBYztBQUNELFFBQUEsc0JBQXNCLEdBQWtDO0lBQ25FLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixFQUFFLDBCQUEwQixFQUFFLHFCQUFxQixFQUFFLGVBQWU7Q0FDeEssQ0FBQztBQUNXLFFBQUEsd0JBQXdCLEdBQUcsSUFBSSxHQUFHLENBQUMsOEJBQXNCLENBQUMsQ0FBQyJ9