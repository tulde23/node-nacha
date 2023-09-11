/**********************|
 * ENTRY ADDENDA TYPES |
 **********************/
import { BaseFieldParams, CamelToTitleCase, NumericalString } from '../Types.js';
export type EntryAddendaFieldKeys = 'recordTypeCode' | 'addendaTypeCode' | 'returnCode' | 'paymentRelatedInformation' | 'addendaSequenceNumber' | 'entryDetailSequenceNumber';
type EntryAddendaFieldKeysWithStringValue = Extract<EntryAddendaFieldKeys, 'paymentRelatedInformation'>;
type EntryAddendaFieldKeysWithNumericalStringValue = Extract<EntryAddendaFieldKeys, 'recordTypeCode' | 'addendaTypeCode' | 'returnCode'>;
type EntryAddendaFieldKeysWithNumberValue = Extract<EntryAddendaFieldKeys, 'addendaSequenceNumber'>;
type EntryAddendaFieldKeysWithNumberValueAndBlank = Extract<EntryAddendaFieldKeys, 'entryDetailSequenceNumber'>;
export type HighLevelAddendaFieldOverrides = 'addendaTypeCode' | 'addendaSequenceNumber' | 'entryDetailSequenceNumber' | 'paymentRelatedInformation';
type EntryAddendaField<Key extends EntryAddendaFieldKeys = EntryAddendaFieldKeys> = {
    name: CamelToTitleCase<Key>;
    number?: boolean;
    paddingChar?: string;
} & BaseFieldParams;
type EntryAddendaFieldWithStringValue<Key extends EntryAddendaFieldKeysWithStringValue = EntryAddendaFieldKeysWithStringValue> = EntryAddendaField<Key> & {
    value: string;
};
type EntryAddendaFieldWithNumericalStringValue<Key extends EntryAddendaFieldKeysWithNumericalStringValue = EntryAddendaFieldKeysWithNumericalStringValue> = EntryAddendaField<Key> & {
    value: NumericalString;
};
type EntryAddendaFieldWithNumberValue<Key extends EntryAddendaFieldKeysWithNumberValue = EntryAddendaFieldKeysWithNumberValue> = EntryAddendaField<Key> & {
    value: number;
};
type EntryAddendaFieldWithBlank<Key extends EntryAddendaFieldKeysWithNumberValueAndBlank = EntryAddendaFieldKeysWithNumberValueAndBlank> = EntryAddendaField<Key> & {
    value: NumericalString;
    blank: boolean;
};
export type EntryAddendaFields = {
    [key in EntryAddendaFieldKeysWithStringValue]: EntryAddendaFieldWithStringValue<key>;
} & {
    [key in EntryAddendaFieldKeysWithNumericalStringValue]: EntryAddendaFieldWithNumericalStringValue<key>;
} & {
    [key in EntryAddendaFieldKeysWithNumberValue]: EntryAddendaFieldWithNumberValue<key>;
} & {
    entryDetailSequenceNumber: EntryAddendaFieldWithBlank<'entryDetailSequenceNumber'>;
};
export type EntryAddendaOptions = {
    fields?: EntryAddendaFields;
    returnCode?: NumericalString;
} & {
    addendaTypeCode?: string;
    addendaSequenceNumber?: number;
    entryDetailSequenceNumber?: number;
    paymentRelatedInformation?: string;
};
export {};
