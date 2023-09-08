/**********************|
 * ENTRY ADDENDA TYPES |
 **********************/
import { BaseFieldParams, CamelToTitleCase, NumericalString } from '../Types.js';
export type EntryAddendaFieldKeys = 'recordTypeCode' | 'addendaTypeCode' | 'paymentRelatedInformation' | 'addendaSequenceNumber' | 'entryDetailSequenceNumber' | 'returnCode';
type EntryAddendaFieldKeysWithStringValue = Extract<EntryAddendaFieldKeys, 'paymentRelatedInformation'>;
type EntryAddendaFieldKeysWithNumericalStringValue = Exclude<EntryAddendaFieldKeys, 'paymentRelatedInformation' | 'entryDetailSequenceNumber'>;
type EntryAddendaFieldKeysWithNumberValueAndBlank = Extract<EntryAddendaFieldKeys, 'entryDetailSequenceNumber'>;
export type HighLevelAddendaFieldOverrides = 'addendaTypeCode' | 'addendaSequenceNumber' | 'entryDetailSequenceNumber' | 'paymentRelatedInformation';
type EntryAddendaField<Key extends EntryAddendaFieldKeys = EntryAddendaFieldKeys> = {
    name: CamelToTitleCase<Key>;
    number?: boolean;
    paddingChar?: string;
} & BaseFieldParams;
type EntryAddendaFieldWithStringValue<Key extends EntryAddendaFieldKeys = EntryAddendaFieldKeys> = EntryAddendaField<Key> & {
    value: string;
};
type EntryAddendaFieldWithNumericalStringValue<Key extends EntryAddendaFieldKeys = EntryAddendaFieldKeys> = EntryAddendaField<Key> & {
    value: NumericalString;
};
type EntryAddendaFieldWithBlank<Key extends EntryAddendaFieldKeys = EntryAddendaFieldKeys> = EntryAddendaField<Key> & {
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
} & {
    addendaTypeCode?: string;
    addendaSequenceNumber?: NumericalString;
    entryDetailSequenceNumber?: number;
    paymentRelatedInformation?: string;
};
export {};
