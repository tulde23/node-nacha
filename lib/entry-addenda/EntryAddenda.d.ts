import { EntryAddendaFields, EntryAddendaOptions } from './entryAddendaTypes.js';
export default class EntryAddenda {
    fields: EntryAddendaFields;
    debug: boolean;
    /**
     * @param {EntryAddendaOptions} options
     * @param {boolean} autoValidate - optional / defaults to true
     * @param {boolean} debug - optional / defaults to false
     */
    constructor(options: EntryAddendaOptions, autoValidate?: boolean, debug?: boolean);
    private validate;
    getReturnCode(): string | false;
    generateString(): Promise<string>;
    get<Key extends keyof EntryAddendaFields = keyof EntryAddendaFields>(field: Key): this['fields'][Key]['value'];
    set<Key extends keyof EntryAddendaFields>(field: Key, value: EntryAddendaFields[Key]['value']): void;
}
