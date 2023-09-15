import { BatchOptions, HighLevelControlOverrides, HighLevelHeaderOverrides } from '../batch/batchTypes.js';
import { EntryAddendaOptions, HighLevelAddendaFieldOverrides } from '../entry-addenda/entryAddendaTypes.js';
import { EntryOptions, HighLevelFieldOverrides } from '../entry/entryTypes.js';
import { FileOptions, HighLevelFileOverrides } from '../file/FileTypes.js';
import { highLevelAddendaFieldOverrideSet, highLevelFieldOverrideSet, highLevelFileOverrideSet } from '../overrides.js';
import { compareSets } from '../utils.js';

type BatchOverrides = Array<HighLevelHeaderOverrides>|Array<HighLevelControlOverrides>
type BatchOverrideRecord = { header: Array<HighLevelHeaderOverrides>, control: Array<HighLevelControlOverrides> }

interface DataMap {
  EntryAddenda: {
    options: EntryAddendaOptions,
    overrides: Array<HighLevelAddendaFieldOverrides>
  },
  Entry: {
    options: EntryOptions,
    overrides: Array<HighLevelFieldOverrides>,
  },
  Batch: {
    options: BatchOptions,
    overrides: { header: Array<HighLevelHeaderOverrides>, control: Array<HighLevelControlOverrides> },
  },
  File: {
    options: FileOptions,
    overrides: Array<HighLevelFileOverrides>,
  }
}

export default class achBuilder<
  DataStruct extends 'Entry'|'EntryAddenda'|'Batch'|'File',
  Options extends DataMap[DataStruct]['options'] = DataMap[DataStruct]['options'],
  Overrides extends DataMap[DataStruct]['overrides'] = DataMap[DataStruct]['overrides'],
  > {
  name!: DataStruct;
  options: Options;
  overrides!: Overrides;
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
  }
}

module.exports = achBuilder;
