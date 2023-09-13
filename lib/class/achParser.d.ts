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
    constructor({ options, name, debug }: {
        options: Options;
        name: DataStruct;
        debug?: boolean;
    });
    get(field: DataStruct extends 'EntryAddenda' ? EntryAddendaFieldKeys : DataStruct extends 'Entry' ? EntryFieldKeys : DataStruct extends 'Batch' ? (BatchHeaderKeys & BatchControlKeys) : DataStruct extends 'File' ? (FileHeaderKeys & FileControlKeys) : never): void;
}
export {};
