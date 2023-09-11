import { EntryAddendaFields, EntryAddendaOptions } from '../entry-addenda/entryAddendaTypes.js';
import achBuilder from './achParser.js';
export default class EntryAddenda extends achBuilder<'EntryAddenda'> {
    fields: EntryAddendaFields;
    constructor(options: EntryAddendaOptions, autoValidate?: boolean, debug?: boolean);
    private validate;
    getReturnCode(): string | false;
    generateString(): string;
    get<Key extends keyof EntryAddendaFields = keyof EntryAddendaFields>(field: Key): this['fields'][Key]['value'];
    set<Key extends keyof EntryAddendaFields>(field: Key, value: EntryAddendaFields[Key]['value']): void;
}
