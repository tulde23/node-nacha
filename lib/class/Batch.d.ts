import { BatchControlFieldWithOptionalValue, BatchControls, BatchHeaders, BatchOptions } from '../batch/batchTypes.js';
import Entry from './Entry.js';
import achBuilder from './achParser.js';
export default class Batch extends achBuilder<'Batch'> {
    header: BatchHeaders;
    control: BatchControls;
    _entries: Array<Entry>;
    constructor(options: BatchOptions, autoValidate?: boolean, debug?: boolean);
    _validate(): void;
    addEntry(entry: Entry): void;
    getEntries(): Entry[];
    generateHeader(): string;
    generateControl(): string;
    generateEntries(): string;
    generateString(): string;
    isAHeaderField(field: keyof BatchHeaders | keyof BatchControls): field is keyof BatchHeaders;
    isAControlField(field: keyof BatchHeaders | keyof BatchControls): field is keyof BatchControls;
    get<Field extends keyof BatchHeaders | keyof BatchControls = keyof BatchHeaders>(field: Field): Field extends keyof BatchHeaders ? typeof this.header[Field]['value'] : Field extends Exclude<keyof BatchControls, BatchControlFieldWithOptionalValue> ? typeof this.control[Field]['value'] : Field extends BatchControlFieldWithOptionalValue ? string | number | undefined : never;
    set<Key extends keyof BatchHeaders | keyof BatchControls = keyof BatchHeaders | keyof BatchControls>(field: Key, value: typeof field extends keyof BatchHeaders ? typeof this.header[Key]['value'] : typeof field extends keyof BatchControls ? typeof this.control[Key]['value'] : never): void;
}
