import { EntryAddendaFields, EntryAddendaOptions } from './entryAddendaTypes.js';
export default class EntryAddenda {
    fields: EntryAddendaFields;
    constructor(options: EntryAddendaOptions, autoValidate: boolean);
    _validate(): void;
    generateString(cb: (string: string) => void): void;
    getReturnCode(): string | false;
    get<Field extends keyof EntryAddendaFields>(field: Field): EntryAddendaFields[Field]['value'];
    set<Field extends keyof EntryAddendaFields>(field: Field, value: EntryAddendaFields[Field]['value']): void;
}
