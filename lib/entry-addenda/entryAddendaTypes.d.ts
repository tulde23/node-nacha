/**********************|
 * ENTRY ADDENDA TYPES |
 **********************/
import { BaseFieldParams, CamelToTitleCase, NumericalString } from '../Types.js';
type EntryAddendaFieldKeys = 'recordTypeCode' | 'addendaTypeCode' | 'paymentRelatedInformation' | 'addendaSequenceNumber' | 'entryDetailSequenceNumber' | 'returnCode';
export type EntryAddendaFieldKeysWithStringValue = Extract<EntryAddendaFieldKeys, 'paymentRelatedInformation'>;
export type EntryAddendaFieldKeysWithNumericalStringValue = Exclude<EntryAddendaFieldKeys, 'paymentRelatedInformation' | 'entryDetailSequenceNumber'>;
export type EntryAddendaFieldKeysWithNumberValueAndBlank = Extract<EntryAddendaFieldKeys, 'entryDetailSequenceNumber'>;
export type HighLevelAddendaFieldOverrides = 'addendaTypeCode' | 'paymentRelatedInformation' | 'addendaSequenceNumber' | 'entryDetailSequenceNumber';
type EntryAddendaField<Key extends EntryAddendaFieldKeys = EntryAddendaFieldKeys> = {
    name: CamelToTitleCase<Key>;
    number?: boolean;
} & BaseFieldParams;
export type EntryAddendaFieldWithStringValue<Key extends EntryAddendaFieldKeys = EntryAddendaFieldKeys> = EntryAddendaField<Key> & {
    value: string;
};
export type EntryAddendaFieldWithNumericalStringValue<Key extends EntryAddendaFieldKeys = EntryAddendaFieldKeys> = EntryAddendaField<Key> & {
    value: NumericalString;
};
export type EntryAddendaFieldWithBlank<Key extends EntryAddendaFieldKeys = EntryAddendaFieldKeys> = EntryAddendaField<Key> & {
    value: number | '';
    blank: boolean;
};
export type EntryAddendaFields = {
    [key in EntryAddendaFieldKeysWithStringValue]: EntryAddendaFieldWithStringValue<key>;
} & {
    [key in EntryAddendaFieldKeysWithNumericalStringValue]: EntryAddendaFieldWithNumericalStringValue<key>;
} & {
    [key in EntryAddendaFieldKeysWithNumberValueAndBlank]: EntryAddendaFieldWithBlank<key>;
};
export type EntryAddendaOptions = {
    fields: EntryAddendaFields;
    returnCode?: NumericalString;
    addendaSequenceNumber?: NumericalString;
    entryDetailSequenceNumber?: number;
} & Record<Exclude<HighLevelAddendaFieldOverrides, 'addendaSequenceNumber' | 'entryDetailSequenceNumber'>, string | undefined>;
export {};
