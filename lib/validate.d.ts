import { NumericalString } from './Types.js';
import Batch from './batch/Batch.js';
import { BatchControls, BatchHeaders } from './batch/batchTypes.js';
import EntryAddenda from './entry-addenda/EntryAddenda.js';
import { EntryAddendaFields } from './entry-addenda/entryAddendaTypes.js';
import Entry from './entry/Entry.js';
import { EntryFields } from './entry/entryTypes.js';
import File from './file/File.js';
import { FileControls, FileHeaders } from './file/FileTypes.js';
export default function validations(classDefinition: File | Batch | Entry | EntryAddenda): {
    validateRequiredFields: (object: EntryAddendaFields | EntryFields | BatchHeaders | BatchControls | FileHeaders | FileControls) => boolean;
    validateRoutingNumber: (routing: NumericalString | number) => boolean;
    validateLengths: (object: EntryAddendaFields | EntryFields | BatchHeaders | BatchControls | FileHeaders | FileControls) => boolean;
    validateDataTypes: (object: EntryAddendaFields | EntryFields | BatchHeaders | BatchControls | FileHeaders | FileControls) => boolean;
    validateACHAddendaTypeCode: (addendaTypeCode: NumericalString) => boolean;
    validateACHServiceClassCode: (serviceClassCode: NumericalString) => boolean;
    getNextMultipleDiff: (value: number, multiple: number) => number;
};
