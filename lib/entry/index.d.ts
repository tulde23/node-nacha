import { fields } from './fields.js';
import type { EntryFields, EntryOptions } from './entryTypes.js';
export default class Entry {
    _addendas: never[];
    fields: EntryFields;
    constructor(options: EntryOptions, autoValidate: boolean);
    addAddenda(entryAddenda: {
        set: (arg0: string, arg1: number) => void;
    }): void;
    getAddendas(): never[];
    getRecordCount(): number;
    generateString(cb: any): void;
    _validate(): void;
    get<Field extends keyof typeof fields = keyof typeof fields>(category: Field): typeof fields[Field]['value'];
    set<Field extends keyof typeof fields = keyof typeof fields>(category: Field, value: string): void;
}
