import { NumericalString } from '../Types.js';
import { BatchControlKeys, BatchControls, BatchHeaderKeys, BatchHeaders, BatchOptions, HighLevelControlOverrides, HighLevelHeaderOverrides } from '../batch/batchTypes.js';
import { EntryAddendaFieldKeys, EntryAddendaFields, EntryAddendaOptions, HighLevelAddendaFieldOverrides } from '../entry-addenda/entryAddendaTypes.js';
import { EntryFieldKeys, EntryFields, EntryOptions, HighLevelFieldOverrides } from '../entry/entryTypes.js';
import { FileControlKeys, FileControls, FileHeaderKeys, FileHeaders, FileOptions, HighLevelFileOverrides } from '../file/FileTypes.js';
type BatchOverrides = Array<HighLevelHeaderOverrides> | Array<HighLevelControlOverrides>;
type BatchOverrideRecord = {
    header: Array<HighLevelHeaderOverrides>;
    control: Array<HighLevelControlOverrides>;
};
interface DataMap {
    EntryAddenda: {
        options: EntryAddendaOptions;
        overrides: Array<HighLevelAddendaFieldOverrides>;
        fields: EntryAddendaFields;
        key: 'fields';
        header: undefined;
        control: undefined;
    };
    Entry: {
        options: EntryOptions;
        overrides: Array<HighLevelFieldOverrides>;
        fields: EntryFields;
        key: 'fields';
        header: undefined;
        control: undefined;
    };
    Batch: {
        options: BatchOptions;
        overrides: {
            header: Array<HighLevelHeaderOverrides>;
            control: Array<HighLevelControlOverrides>;
        };
        key: ['header', 'control'];
        fields: undefined;
        header: BatchHeaders;
        control: BatchControls;
    };
    File: {
        options: FileOptions;
        overrides: Array<HighLevelFileOverrides>;
        key: ['header', 'control'];
        fields: undefined;
        header: FileHeaders;
        control: FileControls;
    };
}
export default class achBuilder<DataStruct extends 'Entry' | 'EntryAddenda' | 'Batch' | 'File', Options extends DataMap[DataStruct]['options'] = DataMap[DataStruct]['options'], Overrides extends DataMap[DataStruct]['overrides'] = DataMap[DataStruct]['overrides'], Fields extends DataMap[DataStruct]['fields'] = DataMap[DataStruct]['fields'], Headers extends DataMap[DataStruct]['header'] = DataMap[DataStruct]['header'], Controls extends DataMap[DataStruct]['control'] = DataMap[DataStruct]['control']> {
    name: DataStruct;
    options: Options;
    overrides: Overrides;
    fields?: Fields;
    header?: Headers;
    control?: Controls;
    debug: boolean;
    typeGuards: {
        isEntryOptions: (arg: FileOptions | BatchOptions | EntryOptions | EntryAddendaOptions) => arg is EntryOptions;
        isEntryAddendaOptions(arg: FileOptions | BatchOptions | EntryOptions | EntryAddendaOptions): arg is EntryAddendaOptions;
        isBatchOptions(arg: FileOptions | BatchOptions | EntryOptions | EntryAddendaOptions): arg is BatchOptions;
        isFileOptions(arg: FileOptions | BatchOptions | EntryOptions | EntryAddendaOptions): arg is FileOptions;
        isEntryOverrides(arg: BatchOverrides | BatchOverrideRecord | Array<HighLevelFieldOverrides> | Array<HighLevelAddendaFieldOverrides> | Array<HighLevelFileOverrides>): arg is HighLevelFieldOverrides[];
        isEntryAddendaOverrides(arg: BatchOverrides | BatchOverrideRecord | Array<HighLevelFieldOverrides> | Array<HighLevelAddendaFieldOverrides> | Array<HighLevelFileOverrides>): arg is HighLevelAddendaFieldOverrides[];
        isFileOverrides(arg: BatchOverrides | BatchOverrideRecord | Array<HighLevelFieldOverrides> | Array<HighLevelAddendaFieldOverrides> | Array<HighLevelFileOverrides>): arg is HighLevelFileOverrides[];
    };
    validations: {
        validateRequiredFields: (object: EntryAddendaFields | EntryFields | BatchHeaders | BatchControls | FileHeaders | FileControls) => boolean;
        validateRoutingNumber(routing: NumericalString | number): boolean;
        validateLengths: (object: EntryAddendaFields | EntryFields | BatchHeaders | BatchControls | FileHeaders | FileControls) => boolean;
        validateDataTypes(object: EntryAddendaFields | EntryFields | BatchHeaders | BatchControls | FileHeaders | FileControls): boolean;
    };
    constructor({ options, name, debug }: {
        options: Options;
        name: DataStruct;
        debug?: boolean;
    });
    overrideOptions(): this | undefined;
    get(field: DataStruct extends 'EntryAddenda' ? EntryAddendaFieldKeys : DataStruct extends 'Entry' ? EntryFieldKeys : DataStruct extends 'Batch' ? (BatchHeaderKeys & BatchControlKeys) : DataStruct extends 'File' ? (FileHeaderKeys & FileControlKeys) : never): void;
    set<Struct extends 'File' | 'Batch' | 'Entry' | 'EntryAddenda', BatchCategoryValue extends Struct extends 'EntryAddenda' ? undefined : Struct extends 'Entry' ? undefined : Struct extends 'Batch' ? 'header' | 'control' : Struct extends 'File' ? 'header' | 'control' : never = Struct extends 'EntryAddenda' ? undefined : Struct extends 'Entry' ? undefined : Struct extends 'Batch' ? 'header' | 'control' : Struct extends 'File' ? 'header' | 'control' : never>(field: Struct extends 'EntryAddenda' ? EntryAddendaFieldKeys : Struct extends 'Entry' ? EntryFieldKeys : Struct extends 'Batch' ? BatchCategoryValue extends 'header' ? BatchHeaderKeys : BatchCategoryValue extends 'control' ? BatchControlKeys : never : Struct extends 'File' ? BatchCategoryValue extends 'header' ? FileHeaderKeys : BatchCategoryValue extends 'control' ? FileControlKeys : never : never, value: Struct extends 'EntryAddenda' ? EntryAddendaFields[EntryAddendaFieldKeys]['value'] : Struct extends 'Entry' ? EntryFields[EntryFieldKeys]['value'] : Struct extends 'Batch' ? BatchCategoryValue extends 'header' ? BatchHeaders[BatchHeaderKeys]['value'] : BatchCategoryValue extends 'control' ? BatchControls[BatchControlKeys]['value'] : never : Struct extends 'File' ? BatchCategoryValue extends 'header' ? FileHeaders[FileHeaderKeys]['value'] : BatchCategoryValue extends 'control' ? FileControls[FileControlKeys]['value'] : never : never): void;
}
export {};
