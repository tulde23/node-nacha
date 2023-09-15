import { BatchOptions, HighLevelControlOverrides, HighLevelHeaderOverrides } from '../batch/batchTypes.js';
import { EntryAddendaOptions, HighLevelAddendaFieldOverrides } from '../entry-addenda/entryAddendaTypes.js';
import { EntryOptions, HighLevelFieldOverrides } from '../entry/entryTypes.js';
import { FileOptions, HighLevelFileOverrides } from '../file/FileTypes.js';
type BatchOverrides = Array<HighLevelHeaderOverrides> | Array<HighLevelControlOverrides>;
type BatchOverrideRecord = {
    header: Array<HighLevelHeaderOverrides>;
    control: Array<HighLevelControlOverrides>;
};
interface DataMap {
    EntryAddenda: {
        options: EntryAddendaOptions;
        overrides: Array<HighLevelAddendaFieldOverrides>;
    };
    Entry: {
        options: EntryOptions;
        overrides: Array<HighLevelFieldOverrides>;
    };
    Batch: {
        options: BatchOptions;
        overrides: {
            header: Array<HighLevelHeaderOverrides>;
            control: Array<HighLevelControlOverrides>;
        };
    };
    File: {
        options: FileOptions;
        overrides: Array<HighLevelFileOverrides>;
    };
}
export default class achBuilder<DataStruct extends 'Entry' | 'EntryAddenda' | 'Batch' | 'File', Options extends DataMap[DataStruct]['options'] = DataMap[DataStruct]['options'], Overrides extends DataMap[DataStruct]['overrides'] = DataMap[DataStruct]['overrides']> {
    name: DataStruct;
    options: Options;
    overrides: Overrides;
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
}
export {};
