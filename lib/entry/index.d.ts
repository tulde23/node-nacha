import { EntryFields, EntryOptions } from '../Types.js';
export declare class Entry {
    _addendas: never[];
    fields: EntryFields;
    constructor(options: EntryOptions, autoValidate: boolean);
    addAddenda(entryAddenda: {
        set: (arg0: string, arg1: number) => void;
    }): void;
    getAddendas(): never[];
    getRecordCount(): number;
    generateString(cb: {
        (string: string): void;
        (arg0: string): void;
    }): void;
    _validate(): void;
    get(category: string): any;
    set(category: string, value: string): void;
}
