import { EntryAddendaFields, EntryAddendaOptions } from '../entry-addenda/entryAddendaTypes.js';
import achBuilder from './achParser.js';

export default class extends achBuilder<'EntryAddenda'> {
  constructor(options: EntryAddendaOptions) {
    super({ options, name: 'EntryAddenda' });
  }

  get(field: keyof EntryAddendaFields) {
    return this.fields![field]['value'];
  }

  set<Field extends keyof EntryAddendaFields>(field: Field, value: EntryAddendaFields[Field]['value']) {
    if (this.fields![field]) {
      if (field === 'entryDetailSequenceNumber') {
        this.fields!.entryDetailSequenceNumber['value'] = Number(value.toString().slice(0 - this.fields![field].width)); // pass last n digits
      } else {
        this.fields![field]['value'] = value;
      }
    }
  }
}
