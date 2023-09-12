import { CamelToTitleCase, BaseFieldParams, NumericalString } from '../Types.js';

//=================
//  HEADER TYPES  |
//=================
export type BatchHeaderKeys = 'recordTypeCode'|'serviceClassCode'|'companyName'|'companyDiscretionaryData'|'companyIdentification'|'standardEntryClassCode'
  | 'companyEntryDescription'|'companyDescriptiveDate'|'effectiveEntryDate'|'settlementDate'|'originatorStatusCode'|'originatingDFI'|'batchNumber';

// Overrides that we will look for in the options object
export type HighLevelHeaderOverrides = 'serviceClassCode'|'companyDiscretionaryData'|'companyIdentification'|'standardEntryClassCode';

// Batch Header Keys with their corresponding value type
type BatchHeaderKeysWithStringValue = Exclude<BatchHeaderKeys, 'companyDiscretionaryData'|'settlementDate'|'serviceClassCode'|'batchNumber'>;
type BatchHeaderKeysWithNumericalStringValue = Extract<BatchHeaderKeys, 'serviceClassCode'>;
type BatchHeaderKeysWithNumberValue = Extract<BatchHeaderKeys, 'batchNumber'>;
type BatchHeaderKeysWithBlankFields = Extract<BatchHeaderKeys, 'companyDiscretionaryData'|'settlementDate'>;

// Batch Header Field
type BatchHeaderField<Key extends BatchHeaderKeys = BatchHeaderKeys> = { name: CamelToTitleCase<Key>; } & BaseFieldParams;
// Batch Header Fields with their corresponding value type
type BatchHeaderFieldWithString<Key extends BatchHeaderKeys = BatchHeaderKeys> = BatchHeaderField<Key> & { value: string; };
type BatchHeaderFieldWithNumericalString<Key extends BatchHeaderKeys = BatchHeaderKeys> = BatchHeaderField<Key> & { value: NumericalString; };
type BatchHeaderFieldWithNumber<Key extends BatchHeaderKeys = BatchHeaderKeys> = BatchHeaderField<Key> & { value: number; };
type BatchHeaderFieldWithBlank<Key extends BatchHeaderKeys = BatchHeaderKeys> = BatchHeaderFieldWithString<Key> & { blank: boolean };

// Batch Headers
export type BatchHeaders = { [key in BatchHeaderKeysWithStringValue]: BatchHeaderFieldWithString<key>; }
  & { [key in BatchHeaderKeysWithNumericalStringValue]: BatchHeaderFieldWithNumericalString<key>; }
  & { [key in BatchHeaderKeysWithNumberValue]: BatchHeaderFieldWithNumber<key>; }
  & { [key in BatchHeaderKeysWithBlankFields]: BatchHeaderFieldWithBlank<key>; };

//==================
//  CONTROL TYPES  |
//==================
export type BatchControlKeys = 'recordTypeCode'|'serviceClassCode'|'addendaCount'|'entryHash'|'totalDebit'|'totalCredit'|'companyIdentification'
  |'messageAuthenticationCode'|'reserved'|'originatingDFI'|'batchNumber';

// Overrides that we will look for in the options object
export type HighLevelControlOverrides = 'addendaCount'|'entryHash'|'totalDebit'|'totalCredit';

type ControlOverrides = Record<HighLevelControlOverrides, number|undefined>;

// Batch Control Keys with their corresponding value type
type BatchControlKeysWithStringFields = Extract<BatchControlKeys, 'recordTypeCode'|'serviceClassCode'>;
type BatchControlKeysWithNumberFields = Extract<BatchControlKeys, 'addendaCount'|'entryHash'|'totalDebit'|'totalCredit'|'batchNumber'>;
type BatchControlKeysWithOptionalValue = Extract<BatchControlKeys, 'companyIdentification'|'originatingDFI'>;
type BatchControlKeysWithBlankFields = Extract<BatchControlKeys, 'messageAuthenticationCode'|'reserved'>;

// Batch Control Fields
type BatchControlField<Key extends BatchControlKeys = BatchControlKeys> = { name: CamelToTitleCase<Key>, number?: boolean } & BaseFieldParams;
// Batch Control Fields with their corresponding value type
export type BatchControlFieldWithString<Key extends BatchControlKeys = BatchControlKeys> = BatchControlField<Key> & { value: string; };
export type BatchControlFieldWithNumber<Key extends BatchControlKeys = BatchControlKeys> = BatchControlField<Key> & { value: number; };
export type BatchControlFieldWithOptionalValue<Key extends BatchControlKeys = BatchControlKeys> = BatchControlField<Key> & { value?: number|string };
export type BatchControlFieldWithBlank<Key extends BatchControlKeys = BatchControlKeys> = BatchControlFieldWithString<Key> & { blank: boolean; };

// Batch Controls
export type BatchControls = { [key in BatchControlKeysWithStringFields]: BatchControlFieldWithString<key>; }
  & { [key in BatchControlKeysWithNumberFields]: BatchControlFieldWithNumber<key>; }
  & { [key in BatchControlKeysWithOptionalValue]: BatchControlFieldWithOptionalValue<key>; }
  & { [key in BatchControlKeysWithBlankFields]: BatchControlFieldWithBlank<key>; };

//==================
//  BATCH OPTIONS  |
//==================
export type BatchOptions = {
  header: BatchHeaders;
  control: BatchControls;
  originatingDFI: NumericalString;
  companyName?: string;
  companyEntryDescription?: string;
  companyDescriptiveDate?: string;
  effectiveEntryDate?: string | Date;
} & {
  serviceClassCode?: NumericalString;
  companyDiscretionaryData?: string;
  companyIdentification?: string;
  standardEntryClassCode?: string;
} & ControlOverrides;
