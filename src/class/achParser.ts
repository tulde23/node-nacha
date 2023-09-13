import { BatchControlKeys, BatchControls, BatchHeaderKeys, BatchHeaders, BatchOptions, HighLevelControlOverrides, HighLevelHeaderOverrides } from '../batch/batchTypes.js';
import { control } from '../batch/control';
import { header } from '../batch/header';
import { EntryAddendaFieldKeys, EntryAddendaFields, EntryAddendaOptions, HighLevelAddendaFieldOverrides } from '../entry-addenda/entryAddendaTypes.js';
import { fields as entryAddendaFields } from '../entry-addenda/fields.js';
import { EntryFieldKeys, EntryFields, EntryOptions, HighLevelFieldOverrides } from '../entry/entryTypes.js';
import { fields as entryFields } from '../entry/fields.js';
import { FileControlKeys, FileControls, FileHeaderKeys, FileHeaders, FileOptions, HighLevelFileOverrides } from '../file/FileTypes.js';
import { fileControls } from '../file/control.js';
import { fileHeaders } from '../file/header.js';
import { highLevelAddendaFieldOverrideSet, highLevelAddendaFieldOverrides, highLevelControlOverrides, highLevelFieldOverrideSet, highLevelFieldOverrides, highLevelFileOverrideSet, highLevelFileOverrides, highLevelHeaderOverrides } from '../overrides.js';
import { compareSets } from '../utils.js';

type BatchOverrides = Array<HighLevelHeaderOverrides>|Array<HighLevelControlOverrides>
type BatchOverrideRecord = { header: Array<HighLevelHeaderOverrides>, control: Array<HighLevelControlOverrides> }

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
  File: {
    options: FileOptions,
    overrides: Array<HighLevelFileOverrides>,
    key: ['header','control']
    fields: undefined,
    header: FileHeaders,
    control: FileControls,
  }
}

export default class achBuilder<
  DataStruct extends 'Entry'|'EntryAddenda'|'Batch'|'File',
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
  public debug = false;

  typeGuards = {
    isEntryOptions: (arg: FileOptions|BatchOptions|EntryOptions|EntryAddendaOptions): arg is EntryOptions => {
      if (typeof arg !== 'object'){
        if (this.debug) console.debug('isEntryOptions() failed because arg is not an object');
        return false;
      }
      if (Object.keys(arg).length === 0){
        if (this.debug) console.debug('isEntryOptions() failed because arg has no keys');
        return false;
      }

      if ('amount' in arg) return true;
      
      if (this.debug) console.debug('isEntryOptions() failed because arg has no amount key', { arg });
      return false;
    },
    isEntryAddendaOptions(arg: FileOptions|BatchOptions|EntryOptions|EntryAddendaOptions): arg is EntryAddendaOptions {
      if (typeof arg !== 'object') return false;
      if (Object.keys(arg).length === 0) return false;
      if ('paymentRelatedInformation' in arg) return true;
    
      return false;
    },
    isBatchOptions(arg: FileOptions|BatchOptions|EntryOptions|EntryAddendaOptions): arg is BatchOptions {
      if (typeof arg !== 'object') return false;
      if (Object.keys(arg).length === 0) return false;
      if ('originatingDFI' in arg) return true;
    
      return false;
    },
    isFileOptions(arg: FileOptions|BatchOptions|EntryOptions|EntryAddendaOptions): arg is FileOptions {
      if (typeof arg !== 'object') return false;
      if (Object.keys(arg).length === 0) return false;
      if ('immediateDestination' in arg) return true;
    
      return false;
    },
    isEntryOverrides(arg: BatchOverrides|BatchOverrideRecord|Array<HighLevelFieldOverrides>|Array<HighLevelAddendaFieldOverrides>|Array<HighLevelFileOverrides>): arg is Array<HighLevelFieldOverrides> {
      if (!Array.isArray(arg)) return false;
      if (arg.length === 0) return false;
    
      return compareSets(new Set(arg), highLevelFieldOverrideSet);
    },
    isEntryAddendaOverrides(arg: BatchOverrides|BatchOverrideRecord|Array<HighLevelFieldOverrides>|Array<HighLevelAddendaFieldOverrides>|Array<HighLevelFileOverrides>): arg is Array<HighLevelAddendaFieldOverrides> {
      if (!Array.isArray(arg)) return false;
      if (arg.length === 0) return false;
      
      return compareSets(new Set(arg), highLevelAddendaFieldOverrideSet);
    },
    isFileOverrides(arg: BatchOverrides|BatchOverrideRecord|Array<HighLevelFieldOverrides>|Array<HighLevelAddendaFieldOverrides>|Array<HighLevelFileOverrides>): arg is Array<HighLevelFileOverrides> {
      if (!Array.isArray(arg)) return false;
      if (arg.length === 0) return false;

      return compareSets(new Set(arg), highLevelFileOverrideSet);
    }
  }

  constructor({ options, name, debug }: { options: Options, name: DataStruct, debug?: boolean }) {
    this.name = name;
    this.options = options;
    this.debug = debug || false;

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
    } else if (this.name === 'File') {
      this.overrides = highLevelFileOverrides as Overrides;

      this.header = ((options as FileOptions).header)
        ? { ...(options as FileOptions).header, ...fileHeaders } as Headers
        : { ...header } as Headers;
      this.control = ((options as FileOptions).control)
        ? { ...(options as FileOptions).control, ...fileControls } as Controls
        : { ...control } as Controls;
    }
  }

  get(field: DataStruct extends 'EntryAddenda'
          ? EntryAddendaFieldKeys
          : DataStruct extends 'Entry'
            ? EntryFieldKeys
            : DataStruct extends 'Batch'
              ? (BatchHeaderKeys & BatchControlKeys)
              : DataStruct extends 'File'
                ? (FileHeaderKeys & FileControlKeys)
                : never) {
    console.log(field);
  }
}

module.exports = achBuilder;
