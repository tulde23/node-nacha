import Entry from '../entry/index.js';
import type { BatchControlFieldWithOptionalValue, BatchControls, BatchHeaders, BatchOptions } from './batchTypes.js';
import { control } from './control';
import { header } from './header';
type HeaderKeys = keyof BatchHeaders;
type ControlKeys = keyof BatchControls;
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
    isAHeaderField(field: HeaderKeys | ControlKeys): field is HeaderKeys;
    isAControlField(field: HeaderKeys | ControlKeys): field is ControlKeys;
    get<Field extends HeaderKeys | ControlKeys = HeaderKeys>(field: Field): Field extends HeaderKeys ? typeof header[Field]['value'] : Field extends Exclude<ControlKeys, BatchControlFieldWithOptionalValue> ? typeof control[Field]['value'] : Field extends BatchControlFieldWithOptionalValue ? string | number | undefined : never;
    set(field: HeaderKeys | ControlKeys, value: typeof field extends HeaderKeys ? typeof header[HeaderKeys]['value'] : typeof control[ControlKeys]['value']): void;
}
export {};
