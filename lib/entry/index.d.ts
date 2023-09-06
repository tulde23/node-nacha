import { fields } from './fields.js';
import { EntryFields, EntryOptions } from '../Types.js';
export default class Entry {
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
    get<Field extends keyof typeof fields = keyof typeof fields>(category: Field): this['fields'][Field]['value'];
    set<Field extends keyof typeof fields = keyof typeof fields>(category: Field, value: string): void;
}
