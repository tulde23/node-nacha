import { BatchControls, BatchHeaders, BatchOptions, HighLevelControlOverrides, HighLevelHeaderOverrides } from '../batch/batchTypes.js';
import { EntryAddendaFields, EntryAddendaOptions, HighLevelAddendaFieldOverrides } from '../entry-addenda/entryAddendaTypes.js';
import { fields as entryAddendaFields } from '../entry-addenda/fields.js';
import { fields as entryFields } from '../entry/fields.js';
import { EntryFields, EntryOptions, HighLevelFieldOverrides } from '../entry/entryTypes.js';
import { highLevelAddendaFieldOverrides, highLevelControlOverrides, highLevelFieldOverrides, highLevelHeaderOverrides } from '../overrides.js';
import { control } from '../batch/control';
import { header } from '../batch/header';

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
    overrides: {
      header: Array<HighLevelHeaderOverrides>,
      control: Array<HighLevelControlOverrides>,
    },
    key: ['header','control']
    fields: undefined
    header: BatchHeaders,
    control: BatchControls,
  },
}

type DataStructures = Extract<keyof DataMap, 'Entry'|'EntryAddenda'|'Batch'>;

export default class achBuilder<
  DataStruct extends DataStructures = 'Entry'|'EntryAddenda'|'Batch',
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

  overrideLowLevel(): void {
    
  }

  categoryIsFields(category: keyof Fields|keyof Headers|keyof Controls): category is keyof Fields {
    if (this.name === 'EntryAddenda' && this.fields) {
      return category in this.fields;
    } else if (this.name === 'Entry' && this.fields) {
      return category in this.fields;
    }

    return false;
  }

  categoryIsKeyOfHeaders(category: keyof Fields|keyof Headers|keyof Controls): category is keyof Headers {
    if (this.name === 'Batch' && this.header) {
      return category in this.header;
    }

    return false;
  }

  categoryIsKeyOfControls(category: keyof Fields|keyof Headers|keyof Controls): category is keyof Controls {
    if (this.name === 'Batch' && this.control) {
      return category in this.control;
    }

    return false;
  }

  set<Field extends DataStruct extends 'EntryAddenda'
      ? keyof Fields
      : DataStruct extends 'Entry'
        ? keyof Fields
        : DataStruct extends 'Batch'
          ? keyof Headers|keyof Controls
          : never,
  >(category: Field, value: string) {
    console.debug({ category, value });
    // If the header has the field, set the value
    
    if (this.name === 'EntryAddenda' && this.fields && this.categoryIsFields(category)) {
        this.fields[category].value = value;
    } else if (this.name === 'Entry' && this.fields && this.categoryIsFields(category)) {
        this.fields[category].value = value;
    } else if (this.name === 'Batch') {
      if (this.header && this.categoryIsKeyOfHeaders(category)) {
        this.header[category].value = value;
      } else if (this.control && this.categoryIsKeyOfControls(category)) {
        this.control[category].value = value;
      }
    }
  }
}

module.exports = achBuilder;
