import { NumericalString } from '../Types.js';
import { BatchControlKeys, BatchControls, BatchHeaderKeys, BatchHeaders, BatchOptions, HighLevelControlOverrides, HighLevelHeaderOverrides } from '../batch/batchTypes.js';
import { EntryAddendaFieldKeys, EntryAddendaFields, EntryAddendaOptions, HighLevelAddendaFieldOverrides } from '../entry-addenda/entryAddendaTypes.js';
import { EntryFieldKeys, EntryFields, EntryOptions, HighLevelFieldOverrides } from '../entry/entryTypes.js';
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
export default class achBuilder<DataStruct extends 'Entry' | 'EntryAddenda' | 'Batch', Options extends DataMap[DataStruct]['options'] = DataMap[DataStruct]['options'], Overrides extends DataMap[DataStruct]['overrides'] = DataMap[DataStruct]['overrides'], Fields extends DataMap[DataStruct]['fields'] = DataMap[DataStruct]['fields'], Headers extends DataMap[DataStruct]['header'] = DataMap[DataStruct]['header'], Controls extends DataMap[DataStruct]['control'] = DataMap[DataStruct]['control']> {
    name: DataStruct;
    options: Options;
    overrides: Overrides;
    fields?: Fields;
    header?: Headers;
    control?: Controls;
    debug: boolean;
    typeGuards: {
        isEntryOptions: (arg: BatchOptions | EntryOptions | EntryAddendaOptions) => arg is EntryOptions;
        isEntryAddendaOptions(arg: BatchOptions | EntryOptions | EntryAddendaOptions): arg is EntryAddendaOptions;
    };
    validations: {
        validateRequiredFields: (object: EntryAddendaFields | EntryFields | BatchHeaders | BatchControls) => boolean;
        validateRoutingNumber(routing: NumericalString | number): boolean;
        validateLengths: (object: EntryAddendaFields | EntryFields | BatchHeaders | BatchControls) => boolean;
    };
    constructor({ options, name, debug }: {
        options: Options;
        name: DataStruct;
        debug?: boolean;
    });
    overrideOptions(): this | undefined;
    get(field: DataStruct extends 'EntryAddenda' ? EntryAddendaFieldKeys : DataStruct extends 'Entry' ? EntryFieldKeys : DataStruct extends 'Batch' ? (BatchHeaderKeys & BatchControlKeys) : never): void;
    set<Struct extends 'Batch' | 'Entry' | 'EntryAddenda', BatchCategoryValue extends Struct extends 'EntryAddenda' ? undefined : Struct extends 'Entry' ? undefined : Struct extends 'Batch' ? 'header' | 'control' : never = Struct extends 'EntryAddenda' ? undefined : Struct extends 'Entry' ? undefined : Struct extends 'Batch' ? 'header' | 'control' : never>(field: Struct extends 'EntryAddenda' ? EntryAddendaFieldKeys : Struct extends 'Entry' ? EntryFieldKeys : Struct extends 'Batch' ? BatchCategoryValue extends 'header' ? BatchHeaderKeys : BatchCategoryValue extends 'control' ? BatchControlKeys : never : never, value: Struct extends 'EntryAddenda' ? EntryAddendaFields[EntryAddendaFieldKeys]['value'] : Struct extends 'Entry' ? EntryFields[EntryFieldKeys]['value'] : Struct extends 'Batch' ? BatchCategoryValue extends 'header' ? BatchHeaders[BatchHeaderKeys]['value'] : BatchCategoryValue extends 'control' ? BatchControls[BatchControlKeys]['value'] : never : never): this | undefined;
}
export {};
