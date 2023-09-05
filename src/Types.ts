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

export type BatchHeaderField<Key extends BatchHeaderKeys = BatchHeaderKeys> = { name: CamelToTitleCase<Key>; value: number|string; } & BaseFieldParams;
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

export interface BatchOptions {
  header: BatchHeaders;
  control: BatchControls;
  originatingDFI: `${number}`;
  companyName?: string;
  companyEntryDescription?: string;
  companyDescriptiveDate?: string;
  effectiveEntryDate?: string | Date;
}

export type EntryFieldKeys = 'recordTypeCode'|'transactionCode'|'receivingDFI'|'checkDigit'|'DFIAccount'|'amount'|'idNumber'|'individualName'|'discretionaryData'|'addendaId'|'traceNumber';
export type EntryFieldKeysCommon = Exclude<EntryFieldKeys, 'transactionCode'|'traceNumber'>;
export type EntryFieldKeysWithNoValue = Extract<EntryFieldKeys, 'transactionCode'>;
export type EntryFieldKeysWithBlank = Extract<EntryFieldKeys, 'traceNumber'>;

export type HighLevelFieldOverrides = 'transactionCode'|'receivingDFI'|'checkDigit'|'DFIAccount'|'amount'|'idNumber'|'individualName'|'discretionaryData'|'addendaId'|'traceNumber';

export type EntryField<Key extends EntryFieldKeys = EntryFieldKeys> = { name: CamelToTitleCase<Key>, number?: boolean, value: number|string; } & BaseFieldParams;
export type EntryFieldWithNoValue<Key extends EntryFieldKeys = EntryFieldKeys> = { name: CamelToTitleCase<Key>, number?: boolean, value?: number|string } & BaseFieldParams;
export type EntryFieldWithBlank<Key extends EntryFieldKeys = EntryFieldKeys> = EntryField<Key> & { blank: boolean; };

export type EntryFields = {
  [key in EntryFieldKeysCommon]: EntryField<key>;
} & {
  [key in EntryFieldKeysWithNoValue]: EntryFieldWithNoValue<key>;
} & {
  [key in EntryFieldKeysWithBlank]: EntryFieldWithBlank<key>;
};

export type EntryOptions = {
  fields: EntryFields;
  receivingDFI: string | number;
  DFIAccount: string | any[];
  amount: any;
  idNumber: any;
  individualName: string | any[];
  discretionaryData: any;
}
