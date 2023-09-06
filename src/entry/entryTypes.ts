/**************|
 * ENTRY TYPES |
 **************/

import { BaseFieldParams, CamelToTitleCase, NumericalString } from '../Types.js';

type EntryFieldKeys = 'recordTypeCode'|'transactionCode'|'receivingDFI'|'checkDigit'|'DFIAccount'|'amount'|'idNumber'|'individualName'
  |'discretionaryData'|'addendaId'|'traceNumber';

// Entry Field Keys with their corresponding value type
export type EntryFieldKeysWithStringValue = Exclude<EntryFieldKeys, 'transactionCode'|'traceNumber'|'receivingDFI'|'checkDigit'|'amount'>;
export type EntryFieldKeysWithNumberValue = Extract<EntryFieldKeys, 'amount'>;
export type EntryFieldKeysWithNumberStringValue = Extract<EntryFieldKeys, 'receivingDFI'|'checkDigit'>;
export type EntryFieldKeysWithOptionalValue = Extract<EntryFieldKeys, 'transactionCode'>;
export type EntryFieldKeysWithBlank = Extract<EntryFieldKeys, 'traceNumber'>;

// Overrides that we will look for in the options object
export type HighLevelFieldOverrides = 'transactionCode'|'receivingDFI'|'checkDigit'|'DFIAccount'|'amount'|'idNumber'|'individualName'|'discretionaryData'|'addendaId'|'traceNumber';

type EntryField<Key extends EntryFieldKeys = EntryFieldKeys> = { name: CamelToTitleCase<Key>, number?: boolean  } & BaseFieldParams;

// Entry Fields
export type EntryFieldWithStringValue<Key extends EntryFieldKeys = EntryFieldKeys> = EntryField<Key> & { value: string; }
export type EntryFieldWithNumberValue<Key extends EntryFieldKeys = EntryFieldKeys> = EntryField<Key> & { value: number | '' };
export type EntryFieldWithNumericalStringValue<Key extends EntryFieldKeys = EntryFieldKeys> = EntryField<Key> & { value: NumericalString };
export type EntryFieldWithOptionalValue<Key extends EntryFieldKeys = EntryFieldKeys> = EntryField<Key> & { value?: NumericalString };
export type EntryFieldWithBlank<Key extends EntryFieldKeys = EntryFieldKeys> = EntryFieldWithNumberValue<Key> & { blank: boolean; };

// Entry Fields Object
export type EntryFields = {
  [key in EntryFieldKeysWithStringValue]: EntryFieldWithStringValue<key>;
} & {
  [key in EntryFieldKeysWithNumberValue]: EntryFieldWithNumberValue<key>;
} & {
  [key in EntryFieldKeysWithNumberStringValue]: EntryFieldWithNumericalStringValue<key>;
} & {
  [key in EntryFieldKeysWithOptionalValue]: EntryFieldWithOptionalValue<key>;
} & {
  [key in EntryFieldKeysWithBlank]: EntryFieldWithBlank<key>;
};

// Entry Options
export type EntryOptions = {
  fields: EntryFields;
  receivingDFI: NumericalString;
  DFIAccount: string;
  amount: string;
  idNumber: string;
  individualName: string;
  discretionaryData: string;
} & Record<HighLevelFieldOverrides, string|undefined>;
