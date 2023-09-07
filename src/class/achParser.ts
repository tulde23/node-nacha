import { BatchControls, BatchHeaders, BatchOptions, HighLevelControlOverrides, HighLevelHeaderOverrides } from '../batch/batchTypes.js';
import { EntryAddendaFields, EntryAddendaOptions, HighLevelAddendaFieldOverrides } from '../entry-addenda/entryAddendaTypes.js';
import { fields as entryAddendaFields } from '../entry-addenda/fields.js';
import { fields as entryFields } from '../entry/fields.js';
import { EntryFields, EntryOptions, HighLevelFieldOverrides } from '../entry/entryTypes.js';
import { highLevelAddendaFieldOverrides, highLevelControlOverrides, highLevelFieldOverrides, highLevelHeaderOverrides } from '../overrides.js';
import { control } from '../batch/control';
import { header } from '../batch/header';
import { isBatchOverrides, overrideLowLevel } from '../utils.js';

interface DataMap {
  EntryAddenda: {
    options: EntryAddendaOptions,
    overrides: Array<HighLevelAddendaFieldOverrides>
    fields: EntryAddendaFields,
    key: 'fields',
    header: undefined,
    control: undefined,
  },
  Entry: {
    options: EntryOptions,
    overrides: Array<HighLevelFieldOverrides>,
    fields: EntryFields
    key: 'fields',
    header: undefined,
    control: undefined,
  },
  Batch: {
    options: BatchOptions,
    overrides: { header: Array<HighLevelHeaderOverrides>, control: Array<HighLevelControlOverrides> },
    key: ['header','control']
    fields: undefined
    header: BatchHeaders,
    control: BatchControls,
  },
}

export default class achBuilder<
  DataStruct extends 'Entry'|'EntryAddenda'|'Batch',
  Options extends DataMap[DataStruct]['options'] = DataMap[DataStruct]['options'],
  Overrides extends DataMap[DataStruct]['overrides'] = DataMap[DataStruct]['overrides'],
  Fields extends DataMap[DataStruct]['fields'] = DataMap[DataStruct]['fields'],
  Headers extends DataMap[DataStruct]['header'] = DataMap[DataStruct]['header'],
  Controls extends DataMap[DataStruct]['control'] = DataMap[DataStruct]['control'],
  > {
  name!: DataStruct;
  options: Options;
  overrides!: Overrides;
  fields?: Fields;
  header?: Headers;
  control?: Controls;

  constructor({ options, name }: { options: Options, name: DataStruct }) {
    this.name = name;
    this.options = options;

    if (this.name === 'EntryAddenda'){
      this.overrides = highLevelAddendaFieldOverrides as Overrides;
      this.fields = ((options as EntryAddendaOptions).fields)
        ? { ...(options as EntryAddendaOptions).fields, ...entryAddendaFields } as Fields
        : entryAddendaFields as Fields;
    } else if (this.name === 'Entry') {
      this.overrides = highLevelFieldOverrides as Overrides;
      this.fields = ((options as EntryOptions).fields)
        ? { ...(options as EntryOptions).fields, ...entryFields } as Fields
        : entryFields as Fields;
    } else if (this.name === 'Batch') {
      this.overrides = { header: highLevelHeaderOverrides, control: highLevelControlOverrides } as Overrides;
      // Allow the batch header/control defaults to be override if provided
      this.header = ((options as BatchOptions).header)
        ? { ...(options as BatchOptions).header, ...header } as Headers
        : { ...header } as Headers;

      this.control = ((options as BatchOptions).control)
        ? { ...(options as BatchOptions).control, ...control } as Controls
        : { ...control } as Controls;
    }
  }

  overrideOptions(){

    if (this.overrides?.header)
    overrideLowLevel(this.overrides, this.options, self)
  }

  categoryIsKeyOfEntryAddendaFields(category: keyof EntryAddendaFields|keyof EntryFields|keyof Headers|keyof Controls): category is keyof EntryAddendaFields {
    return (this.name === 'EntryAddenda' && this.fields !== undefined && category in this.fields);
  }

  categoryIsKeyOfEntryFields(category: keyof EntryFields|keyof EntryAddendaFields|keyof Headers|keyof Controls): category is keyof EntryFields {
    return (this.name === 'Entry' && this.fields !== undefined && category in this.fields);
  }

  categoryIsKeyOfHeaders(category: keyof Fields|keyof Headers|keyof Controls): category is keyof Headers {
    return (this.name === 'Batch' && this.header !== undefined && category in this.header)
  }

  categoryIsKeyOfControls(category: keyof Fields|keyof Headers|keyof Controls): category is keyof Controls {
    return (this.name === 'Batch' && this.control !== undefined && category in this.control)
  }

  get(field: DataStruct extends 'EntryAddenda'
          ? keyof EntryAddendaFields
          : DataStruct extends 'Entry'
            ? keyof EntryFields
            : DataStruct extends 'Batch'
              ? keyof (Headers & Controls)
              : never) {
    console.log(field);
  }

  set(category: DataStruct extends 'EntryAddenda'
  ? keyof EntryAddendaFields
  : DataStruct extends 'Entry'
    ? keyof EntryFields
    : DataStruct extends 'Batch'
      ? keyof (Headers & Controls)
      : never, value: string) {
        console.log(category, value)
      }
}

module.exports = achBuilder;
