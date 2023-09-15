import { CamelToTitleCase, BaseFieldParams, NumericalString } from '../Types.js';

export type HighLevelFileOverrides = 'immediateDestination'|'immediateOrigin'|'fileCreationDate'|'fileCreationTime'|'fileIdModifier'|'immediateDestinationName'|'immediateOriginName'|'referenceCode';

//=================
//  HEADER TYPES  |
//=================
export type FileHeaderKeys = 'recordTypeCode'|'priorityCode'|'immediateDestination'|'immediateOrigin'|'fileCreationDate'|'fileCreationTime'|'fileIdModifier'|'recordSize'|'blockingFactor'|'formatCode'|'immediateDestinationName'|'immediateOriginName'|'referenceCode';

type FileHeaderKeysWithStringFields = 'immediateDestination'|'immediateOrigin'|'fileCreationDate'|'fileCreationTime'|'fileIdModifier'|'immediateDestinationName'|'immediateOriginName'|'referenceCode';
type FileHeaderKeysWithNumericalStringFields = 'recordTypeCode'|'priorityCode'|'recordSize'|'blockingFactor'|'formatCode';

// File Header Field
type FileHeaderField<Key extends FileHeaderKeys = FileHeaderKeys> = { name: CamelToTitleCase<Key>; paddingChar?: string } & BaseFieldParams;

// File Header Fields with their corresponding value type
export type FileHeaderFieldWithString<Key extends FileHeaderKeysWithStringFields = FileHeaderKeysWithStringFields> = FileHeaderField<Key> & { value: string; };
export type FileHeaderFieldWithNumericalString<Key extends FileHeaderKeysWithNumericalStringFields = FileHeaderKeysWithNumericalStringFields> = FileHeaderField<Key> & { value: NumericalString; };

// File Headers
export type FileHeaders = {
  [key in FileHeaderKeysWithStringFields]: FileHeaderFieldWithString<key>;
} & {
  [key in FileHeaderKeysWithNumericalStringFields]: FileHeaderFieldWithNumericalString<key>;
};

//==================
//  CONTROL TYPES  |
//==================
export type FileControlKeys = 'recordTypeCode'|'addendaCount'|'entryHash'|'totalDebit'|'totalCredit'|'batchCount'|'blockCount'|'reserved';

// File Control Keys with their corresponding value type
type FileControlKeysWithStringFields = 'reserved';
type FileControlKeysWithNumericalStringFields = 'recordTypeCode';
type FileControlKeysWithNumberFields = 'addendaCount'|'entryHash'|'totalDebit'|'totalCredit'|'batchCount'|'blockCount'

// File Control Fields
type FileControlField<Key extends FileControlKeys = FileControlKeys> = { name: CamelToTitleCase<Key>|string, number?: boolean } & { width: number; position: number; type: 'numeric'|'alphanumeric'|'alpha'|'ABA'; };

// File Control Fields with their corresponding value type
export type FileControlFieldWithString<Key extends FileControlKeysWithStringFields = FileControlKeysWithStringFields> = FileControlField<Key> & { value: string; blank: boolean; };
export type FileControlFieldWithNumericalString<Key extends FileControlKeysWithNumericalStringFields = FileControlKeysWithNumericalStringFields> = FileControlField<Key> & { value: NumericalString; };
export type FileControlFieldWithNumber<Key extends FileControlKeysWithNumberFields = FileControlKeysWithNumberFields> = FileControlField<Key> & { value: number; };

// File Controls
export type FileControls = {
  reserved: FileControlFieldWithString<'reserved'>;
  recordTypeCode: FileControlFieldWithNumericalString<'recordTypeCode'>;
} & {
  [key in FileControlKeysWithNumberFields]: FileControlFieldWithNumber<key>;
};

//==================
//  File OPTIONS  |
//==================
export type FileOptions = {
  header?: FileHeaders;
  control?: FileControls;
  immediateDestination: NumericalString;
  immediateOrigin: string;
  batchSequenceNumber?: number,
} & {
  [key in HighLevelFileOverrides]?: string|number;
}
