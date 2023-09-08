import { CamelToTitleCase, BaseFieldParams, NumericalString } from '../Types.js';
export type BatchHeaderKeys = 'recordTypeCode' | 'serviceClassCode' | 'companyName' | 'companyDiscretionaryData' | 'companyIdentification' | 'standardEntryClassCode' | 'companyEntryDescription' | 'companyDescriptiveDate' | 'effectiveEntryDate' | 'settlementDate' | 'originatorStatusCode' | 'originatingDFI' | 'batchNumber';
export type HighLevelHeaderOverrides = 'serviceClassCode' | 'companyDiscretionaryData' | 'companyIdentification' | 'standardEntryClassCode';
type BatchHeaderKeysWithStringValue = Exclude<BatchHeaderKeys, 'companyDiscretionaryData' | 'settlementDate' | 'serviceClassCode' | 'batchNumber'>;
type BatchHeaderKeysWithNumericalStringValue = Extract<BatchHeaderKeys, 'serviceClassCode'>;
type BatchHeaderKeysWithNumberValue = Extract<BatchHeaderKeys, 'batchNumber'>;
type BatchHeaderKeysWithBlankFields = Extract<BatchHeaderKeys, 'companyDiscretionaryData' | 'settlementDate'>;
type BatchHeaderField<Key extends BatchHeaderKeys = BatchHeaderKeys> = {
    name: CamelToTitleCase<Key>;
} & BaseFieldParams;
type BatchHeaderFieldWithString<Key extends BatchHeaderKeys = BatchHeaderKeys> = BatchHeaderField<Key> & {
    value: string;
};
type BatchHeaderFieldWithNumericalString<Key extends BatchHeaderKeys = BatchHeaderKeys> = BatchHeaderField<Key> & {
    value: NumericalString;
};
type BatchHeaderFieldWithNumber<Key extends BatchHeaderKeys = BatchHeaderKeys> = BatchHeaderField<Key> & {
    value: number;
};
type BatchHeaderFieldWithBlank<Key extends BatchHeaderKeys = BatchHeaderKeys> = BatchHeaderFieldWithString<Key> & {
    blank: boolean;
};
export type BatchHeaders = {
    [key in BatchHeaderKeysWithStringValue]: BatchHeaderFieldWithString<key>;
} & {
    [key in BatchHeaderKeysWithNumericalStringValue]: BatchHeaderFieldWithNumericalString<key>;
} & {
    [key in BatchHeaderKeysWithNumberValue]: BatchHeaderFieldWithNumber<key>;
} & {
    [key in BatchHeaderKeysWithBlankFields]: BatchHeaderFieldWithBlank<key>;
};
export type BatchControlKeys = 'recordTypeCode' | 'serviceClassCode' | 'addendaCount' | 'entryHash' | 'totalDebit' | 'totalCredit' | 'companyIdentification' | 'messageAuthenticationCode' | 'reserved' | 'originatingDFI' | 'batchNumber';
export type HighLevelControlOverrides = 'addendaCount' | 'entryHash' | 'totalDebit' | 'totalCredit';
type ControlOverrides = Record<HighLevelControlOverrides, number | undefined>;
type BatchControlKeysWithStringFields = Extract<BatchControlKeys, 'recordTypeCode' | 'serviceClassCode'>;
type BatchControlKeysWithNumberFields = Extract<BatchControlKeys, 'addendaCount' | 'entryHash' | 'totalDebit' | 'totalCredit' | 'batchNumber'>;
type BatchControlKeysWithOptionalValue = Extract<BatchControlKeys, 'companyIdentification' | 'originatingDFI'>;
type BatchControlKeysWithBlankFields = Extract<BatchControlKeys, 'messageAuthenticationCode' | 'reserved'>;
type BatchControlField<Key extends BatchControlKeys = BatchControlKeys> = {
    name: CamelToTitleCase<Key>;
    number?: boolean;
} & BaseFieldParams;
type BatchControlFieldWithString<Key extends BatchControlKeys = BatchControlKeys> = BatchControlField<Key> & {
    value: string;
};
type BatchControlFieldWithNumber<Key extends BatchControlKeys = BatchControlKeys> = BatchControlField<Key> & {
    value: number;
};
type BatchControlFieldWithOptionalValue<Key extends BatchControlKeys = BatchControlKeys> = BatchControlField<Key> & {
    value?: number | string;
};
type BatchControlFieldWithBlank<Key extends BatchControlKeys = BatchControlKeys> = BatchControlFieldWithString<Key> & {
    blank: boolean;
};
export type BatchControls = {
    [key in BatchControlKeysWithStringFields]: BatchControlFieldWithString<key>;
} & {
    [key in BatchControlKeysWithNumberFields]: BatchControlFieldWithNumber<key>;
} & {
    [key in BatchControlKeysWithOptionalValue]: BatchControlFieldWithOptionalValue<key>;
} & {
    [key in BatchControlKeysWithBlankFields]: BatchControlFieldWithBlank<key>;
};
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
export {};
