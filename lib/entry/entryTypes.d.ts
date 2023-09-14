/**************|
 * ENTRY TYPES |
 **************/
import { BaseFieldParams, CamelToTitleCase, NumericalString } from '../Types.js';
export type EntryFieldKeys = 'recordTypeCode' | 'transactionCode' | 'receivingDFI' | 'checkDigit' | 'DFIAccount' | 'amount' | 'idNumber' | 'individualName' | 'discretionaryData' | 'addendaId' | 'traceNumber';
type EntryFieldKeysWithStringValue = Exclude<EntryFieldKeys, 'transactionCode' | 'traceNumber' | 'receivingDFI' | 'checkDigit' | 'amount'>;
type EntryFieldKeysWithNumberValue = Extract<EntryFieldKeys, 'amount'>;
type EntryFieldKeysWithNumberStringValue = Extract<EntryFieldKeys, 'receivingDFI' | 'checkDigit'>;
type EntryFieldKeysWithOptionalValue = Extract<EntryFieldKeys, 'transactionCode'>;
type EntryFieldKeysWithBlank = Extract<EntryFieldKeys, 'traceNumber'>;
export type HighLevelFieldOverrides = 'transactionCode' | 'receivingDFI' | 'checkDigit' | 'DFIAccount' | 'amount' | 'idNumber' | 'individualName' | 'discretionaryData' | 'addendaId' | 'traceNumber';
type EntryField<Key extends EntryFieldKeys = EntryFieldKeys> = {
    name: CamelToTitleCase<Key>;
    number?: boolean;
} & BaseFieldParams;
type EntryFieldWithStringValue<Key extends EntryFieldKeys = EntryFieldKeys> = EntryField<Key> & {
    value: string;
};
type EntryFieldWithNumberValue<Key extends EntryFieldKeys = EntryFieldKeys> = EntryField<Key> & {
    value: number | '';
};
type EntryFieldWithNumericalStringValue<Key extends EntryFieldKeys = EntryFieldKeys> = EntryField<Key> & {
    value: NumericalString;
};
type EntryFieldWithOptionalValue<Key extends EntryFieldKeys = EntryFieldKeys> = EntryField<Key> & {
    value?: NumericalString;
};
type EntryFieldWithBlank<Key extends EntryFieldKeys = EntryFieldKeys> = EntryFieldWithNumericalStringValue<Key> & {
    blank: boolean;
};
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
export type EntryOptions = {
    fields?: EntryFields;
    receivingDFI: NumericalString;
    DFIAccount: string;
    amount: string;
    idNumber: string;
    individualName: string;
    discretionaryData: string;
    transactionCode?: NumericalString;
} & {
    [key in Exclude<HighLevelFieldOverrides, 'receivingDFI' | 'DFIAccount' | 'amount' | 'idNumber' | 'individualName' | 'discretionaryData' | 'transactionCode'>]?: string;
};
export {};
