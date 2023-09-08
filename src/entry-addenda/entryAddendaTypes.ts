/**********************|
 * ENTRY ADDENDA TYPES |
 **********************/

import { BaseFieldParams, CamelToTitleCase, NumericalString } from '../Types.js';

export type EntryAddendaFieldKeys = 'recordTypeCode'|'addendaTypeCode'|'paymentRelatedInformation'|'addendaSequenceNumber'|'entryDetailSequenceNumber'|'returnCode';

// Entry Addenda Field Keys with their corresponding value type
type EntryAddendaFieldKeysWithStringValue = Extract<EntryAddendaFieldKeys, 'paymentRelatedInformation'>;
type EntryAddendaFieldKeysWithNumericalStringValue = Exclude<EntryAddendaFieldKeys, 'paymentRelatedInformation' | 'entryDetailSequenceNumber'>;
type EntryAddendaFieldKeysWithNumberValueAndBlank = Extract<EntryAddendaFieldKeys, 'entryDetailSequenceNumber'>;

// Overrides that we will look for in the options object
export type HighLevelAddendaFieldOverrides = 'addendaTypeCode'|'addendaSequenceNumber'|'entryDetailSequenceNumber'|'paymentRelatedInformation';

type EntryAddendaField<Key extends EntryAddendaFieldKeys = EntryAddendaFieldKeys> = { name: CamelToTitleCase<Key>, number?: boolean, paddingChar?: string } & BaseFieldParams;

// Entry Addenda Fields
type EntryAddendaFieldWithStringValue<Key extends EntryAddendaFieldKeys = EntryAddendaFieldKeys> = EntryAddendaField<Key> & { value: string; }
type EntryAddendaFieldWithNumericalStringValue<Key extends EntryAddendaFieldKeys = EntryAddendaFieldKeys> = EntryAddendaField<Key> & { value: NumericalString };
type EntryAddendaFieldWithBlank<Key extends EntryAddendaFieldKeys = EntryAddendaFieldKeys> = EntryAddendaField<Key> & { value: number|'', blank: boolean; };

// Entry Addenda Fields Object
export type EntryAddendaFields = {
  [key in EntryAddendaFieldKeysWithStringValue]: EntryAddendaFieldWithStringValue<key>;
} & {
  [key in EntryAddendaFieldKeysWithNumericalStringValue]: EntryAddendaFieldWithNumericalStringValue<key>;
} & {
  [key in EntryAddendaFieldKeysWithNumberValueAndBlank]: EntryAddendaFieldWithBlank<key>;
};

// Entry Options
export type EntryAddendaOptions = {
  fields: EntryAddendaFields;
  returnCode?: NumericalString;
} & { // Overrides
  addendaTypeCode?: string;
  addendaSequenceNumber?: NumericalString;
  entryDetailSequenceNumber?: number, // last n digits. pass
  paymentRelatedInformation?: string;
};

