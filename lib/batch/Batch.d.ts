import Entry from '../entry/Entry.js';
import { BatchControlFieldWithOptionalValue, BatchControls, BatchHeaders, BatchOptions, HighLevelControlOverrides, HighLevelHeaderOverrides } from './batchTypes.js';
export default class Batch {
    options: BatchOptions;
    overrides: {
        header: Array<HighLevelHeaderOverrides>;
        control: Array<HighLevelControlOverrides>;
    };
    header: BatchHeaders;
    control: BatchControls;
    _entries: Array<Entry>;
    debug: boolean;
    constructor(options: BatchOptions, autoValidate?: boolean, debug?: boolean);
    _validate(): void;
    addEntry(entry: Entry): void;
    getEntries(): Entry[];
    generateHeader(): Promise<string>;
    generateControl(): Promise<string>;
    generateEntries(): Promise<string>;
    generateString(): Promise<string>;
    isAHeaderField(field: keyof BatchHeaders | keyof BatchControls): field is keyof BatchHeaders;
    isAControlField(field: keyof BatchHeaders | keyof BatchControls): field is keyof BatchControls;
    get<Field extends keyof BatchHeaders | keyof BatchControls = keyof BatchHeaders>(field: Field): Field extends keyof BatchHeaders ? typeof this.header[Field]['value'] : Field extends Exclude<keyof BatchControls, BatchControlFieldWithOptionalValue> ? typeof this.control[Field]['value'] : Field extends BatchControlFieldWithOptionalValue ? string | number | undefined : never;
    set<Key extends keyof BatchHeaders | keyof BatchControls = keyof BatchHeaders | keyof BatchControls>(field: Key, value: typeof field extends keyof BatchHeaders ? typeof this.header[Key]['value'] : typeof field extends keyof BatchControls ? typeof this.control[Key]['value'] : never): void;
}
