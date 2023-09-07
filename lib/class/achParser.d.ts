import { BatchControls, BatchHeaders, BatchOptions, HighLevelControlOverrides, HighLevelHeaderOverrides } from '../batch/batchTypes.js';
import { EntryAddendaFields, EntryAddendaOptions, HighLevelAddendaFieldOverrides } from '../entry-addenda/entryAddendaTypes.js';
import { EntryFields, EntryOptions, HighLevelFieldOverrides } from '../entry/entryTypes.js';
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
}
type DataStructures = Extract<keyof DataMap, 'Entry' | 'EntryAddenda' | 'Batch'>;
export default class achBuilder<DataStruct extends DataStructures = 'Entry' | 'EntryAddenda' | 'Batch', Options extends DataMap[DataStruct]['options'] = DataMap[DataStruct]['options'], Overrides extends DataMap[DataStruct]['overrides'] = DataMap[DataStruct]['overrides'], Fields extends DataMap[DataStruct]['fields'] = DataMap[DataStruct]['fields'], Headers extends DataMap[DataStruct]['header'] = DataMap[DataStruct]['header'], Controls extends DataMap[DataStruct]['control'] = DataMap[DataStruct]['control']> {
    name: DataStruct;
    options: Options;
    overrides: Overrides;
    fields?: Fields;
    header?: Headers;
    control?: Controls;
    constructor({ options, name }: {
        options: Options;
        name: DataStruct;
    });
    overrideLowLevel(): void;
    categoryIsFields(category: keyof Fields | keyof Headers | keyof Controls): category is keyof Fields;
    categoryIsKeyOfHeaders(category: keyof Fields | keyof Headers | keyof Controls): category is keyof Headers;
    categoryIsKeyOfControls(category: keyof Fields | keyof Headers | keyof Controls): category is keyof Controls;
    set<Field extends DataStruct extends 'EntryAddenda' ? keyof Fields : DataStruct extends 'Entry' ? keyof Fields : DataStruct extends 'Batch' ? keyof Headers | keyof Controls : never>(category: Field, value: string): void;
}
export {};
