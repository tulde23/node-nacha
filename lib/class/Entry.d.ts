import { EntryFields, EntryOptions } from '../entry/entryTypes.js';
import EntryAddenda from './EntryAddenda.js';
import achBuilder from './achParser.js';
export default class Entry extends achBuilder<'Entry'> {
    fields: EntryFields;
    _addendas: Array<EntryAddenda>;
    constructor(options: EntryOptions, autoValidate?: boolean);
    addAddenda(entryAddenda: EntryAddenda): void;
    getAddendas(): EntryAddenda[];
    getRecordCount(): number;
    _validate(): void;
    generateString(): string[];
}
