import { fields } from './fields.js';
import type { EntryFields, EntryOptions } from './entryTypes.js';
import EntryAddenda from '../entry-addenda/index.js';
export default class Entry {
    _addendas: Array<EntryAddenda>;
    fields: EntryFields;
    constructor(options: EntryOptions, autoValidate: boolean);
    addAddenda(entryAddenda: EntryAddenda): void;
    getAddendas(): EntryAddenda[];
    getRecordCount(): number;
    generateString(cb: any): void;
    _validate(): void;
    get<Field extends keyof typeof fields = keyof typeof fields>(category: Field): typeof fields[Field]['value'];
    set<Field extends keyof typeof fields = keyof typeof fields>(category: Field, value: string): void;
}
