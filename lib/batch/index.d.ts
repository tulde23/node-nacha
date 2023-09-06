import type { BatchControls, BatchHeaders, BatchOptions } from '../Types.js';
import { control } from './control';
import { header } from './header';
import Entry from '../entry/index.js';
export default class Batch {
    _entries: Array<Entry>;
    header: BatchHeaders;
    control: BatchControls;
    constructor(options: BatchOptions, autoValidate: boolean);
    _validate(): void;
    addEntry(entry: Entry): Promise<void>;
    getEntries(): Entry[];
    generateHeader(cb: (arg0: string) => void): void;
    generateControl(cb: (arg0: string) => void): void;
    generateEntries(cb: (arg0: string) => void): void;
    generateString(cb: (arg0: string) => void): void;
    get<Field extends keyof typeof header | keyof typeof control = keyof typeof header | keyof typeof control>(field: Field): string | number | undefined;
    set<Field extends keyof typeof header | keyof typeof control = keyof typeof header | keyof typeof control>(field: Field, value: string | number): void;
}
