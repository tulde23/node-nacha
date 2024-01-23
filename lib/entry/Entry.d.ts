import EntryAddenda from "../entry-addenda/EntryAddenda.js";
import { EntryFields, EntryOptions } from "./entryTypes.js";
/**
 * @class Entry
 * @description Entry class that will be used to create Entry objects
 * @param {EntryOptions} options - required
 * @param {boolean} autoValidate - optional / defaults to true
 * @param {boolean} debug - optional / defaults to false
 */
export default class Entry {
    debug: boolean;
    fields: EntryFields;
    addendas: Array<EntryAddenda>;
    /**
     * @param {EntryOptions} options - required
     * @param {boolean} autoValidate - optional / defaults to true
     * @param {boolean} debug - optional / defaults to false
     * @returns {Entry}
     */
    constructor(options: EntryOptions, autoValidate?: boolean, debug?: boolean);
    addAddenda(entryAddenda: EntryAddenda): void;
    getAddendas(): EntryAddenda[];
    getRecordCount(): number;
    _validate(): void;
    generateString(): Promise<string>;
    get<Key extends keyof EntryFields = keyof EntryFields>(field: Key): this["fields"][Key]["value"];
    set<Key extends keyof EntryFields = keyof EntryFields>(field: Key, value: (typeof this)["fields"][Key]["value"]): void;
}
