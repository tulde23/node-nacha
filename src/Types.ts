
type CamelToTitleCase<Text extends string, $Acc extends string = ''> =
  Text extends `${infer $Ch}${infer $Rest}`
    ? Text extends Capitalize<Text>
      ? CamelToTitleCase<$Rest, `${Capitalize<$Acc>} ${Capitalize<$Ch>}`>
    : CamelToTitleCase<$Rest, `${$Acc}${$Ch}`>
    : Capitalize<$Acc>;

export type NumericalString = `${number}`;

export type BatchHeaderKeys = 'recordTypeCode'|'serviceClassCode'|'companyName'|'companyDiscretionaryData'|'companyIdentification'|'standardEntryClassCode'|'companyEntryDescription'|'companyDescriptiveDate'|'effectiveEntryDate'|'settlementDate'|'originatorStatusCode'|'originatingDFI'|'batchNumber';
export type BatchHeaderKeysWithFields = Exclude<BatchHeaderKeys, 'companyDiscretionaryData'|'settlementDate'>;
export type BatchHeaderKeysWithBlankFields = Extract<BatchHeaderKeys, 'companyDiscretionaryData'|'settlementDate'>;

export type HighLevelHeaderOverrides = 'serviceClassCode'|'companyDiscretionaryData'|'companyIdentification'|'standardEntryClassCode';

type BaseFieldParams = { width: number; position: number; required: boolean; type: 'numeric'|'alphanumeric'|'alpha'; }

export type BatchHeaderField<Key extends BatchHeaderKeys = BatchHeaderKeys> = { name: CamelToTitleCase<Key>; value: Key extends 'serviceClassCode' ? `${number}` : number|string; } & BaseFieldParams;
export type BatchHeaderFieldWithBlank<Key extends BatchHeaderKeys = BatchHeaderKeys> = BatchHeaderField<Key> & { blank: boolean; };

export type BatchControlKeys = 'recordTypeCode'|'serviceClassCode'|'addendaCount'|'entryHash'|'totalDebit'|'totalCredit'|'companyIdentification'|'messageAuthenticationCode'|'reserved'|'originatingDFI' | 'batchNumber';
export type BatchControlKeysWithFields = Exclude<BatchControlKeys, 'companyIdentification'|'messageAuthenticationCode'|'reserved'|'originatingDFI'>;
export type BatchControlKeysWithNoValue = Extract<BatchControlKeys, 'companyIdentification'|'originatingDFI'>;
export type BatchControlKeysWithBlankFields = Extract<BatchControlKeys, 'messageAuthenticationCode'|'reserved'>;

export type HighLevelControlOverrides = 'addendaCount'|'entryHash'|'totalDebit'|'totalCredit';

export type BatchControlField<Key extends BatchControlKeys = BatchControlKeys> = { name: CamelToTitleCase<Key>, number?: boolean, value: number|string; } & BaseFieldParams;
export type BatchControlFieldWithNoValue<Key extends BatchControlKeys = BatchControlKeys> = { name: CamelToTitleCase<Key>, number?: boolean, value?: number|string } & BaseFieldParams;
export type BatchControlFieldWithBlank<Key extends BatchControlKeys = BatchControlKeys> = BatchControlField<Key> & { blank: boolean; };

export type BatchHeaders = {
  [key in BatchHeaderKeysWithFields]: BatchHeaderField<key>;
} & {
  [key in BatchHeaderKeysWithBlankFields]: BatchHeaderFieldWithBlank<key>;
};

export type BatchControls = {
  [key in BatchControlKeysWithFields]: BatchControlField<key>;
} & {
  [key in BatchControlKeysWithNoValue]: BatchControlFieldWithNoValue<key>;
} & {
  [key in BatchControlKeysWithBlankFields]: BatchControlFieldWithBlank<key>;
};

export type BatchOptions = {
  header: BatchHeaders;
  control: BatchControls;
  originatingDFI: `${number}`;
  companyName?: string;
  companyEntryDescription?: string;
  companyDescriptiveDate?: string;
  effectiveEntryDate?: string | Date;
} & Record<HighLevelHeaderOverrides, string|number|undefined> & Record<HighLevelControlOverrides, string|number|undefined>;

export type EntryFieldKeys = 'recordTypeCode'|'transactionCode'|'receivingDFI'|'checkDigit'|'DFIAccount'|'amount'|'idNumber'|'individualName'|'discretionaryData'|'addendaId'|'traceNumber';
export type EntryFieldKeysWithStringValue = Exclude<EntryFieldKeys, 'transactionCode'|'traceNumber'|'receivingDFI'|'checkDigit'|'amount'>;
export type EntryFieldKeysWithNumberValue = Extract<EntryFieldKeys, 'amount'>;
export type EntryFieldKeysWithNumberStringValue = Extract<EntryFieldKeys, 'receivingDFI'|'checkDigit'>;
export type EntryFieldKeysWithOptionalValue = Extract<EntryFieldKeys, 'transactionCode'>;
export type EntryFieldKeysWithBlank = Extract<EntryFieldKeys, 'traceNumber'>;

export type HighLevelFieldOverrides = 'transactionCode'|'receivingDFI'|'checkDigit'|'DFIAccount'|'amount'|'idNumber'|'individualName'|'discretionaryData'|'addendaId'|'traceNumber';

type EntryField<Key extends EntryFieldKeys = EntryFieldKeys> = { name: CamelToTitleCase<Key>, number?: boolean  } & BaseFieldParams;
export type EntryFieldWithStringValue<Key extends EntryFieldKeys = EntryFieldKeys> = EntryField<Key> & { value: string; } & BaseFieldParams
export type EntryFieldWithNumberValue<Key extends EntryFieldKeys = EntryFieldKeys> = EntryField<Key> & { value: number } & BaseFieldParams;
export type EntryFieldWithNumberStringValue<Key extends EntryFieldKeys = EntryFieldKeys> = EntryField<Key> & { value: `${number}` } & BaseFieldParams;
export type EntryFieldWithOptionalValue<Key extends EntryFieldKeys = EntryFieldKeys> = { name: CamelToTitleCase<Key>, number?: boolean, value?: `${number}` } & BaseFieldParams;
export type EntryFieldWithBlank<Key extends EntryFieldKeys = EntryFieldKeys> = EntryFieldWithNumberValue<Key> & { value: number, blank: boolean; } & BaseFieldParams;

export type EntryFields = {
  [key in EntryFieldKeysWithStringValue]: EntryFieldWithStringValue<key>;
} & {
  [key in EntryFieldKeysWithNumberValue]: EntryFieldWithNumberValue<key>;
} & {
  [key in EntryFieldKeysWithNumberStringValue]: EntryFieldWithNumberStringValue<key>;
} & {
  [key in EntryFieldKeysWithOptionalValue]: EntryFieldWithOptionalValue<key>;
} & {
  [key in EntryFieldKeysWithBlank]: EntryFieldWithBlank<key>;
};

export type EntryOptions = {
  fields: EntryFields;
  receivingDFI: `${number}`;
  DFIAccount: string;
  amount: string;
  idNumber: string;
  individualName: string;
  discretionaryData: string;
} & Record<HighLevelFieldOverrides, string|undefined>;
