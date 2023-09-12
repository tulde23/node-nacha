import { NumericalString } from '../Types.js';
import { BatchControlKeys, BatchControls, BatchHeaderKeys, BatchHeaders, BatchOptions, HighLevelControlOverrides, HighLevelHeaderOverrides } from '../batch/batchTypes.js';
import { control } from '../batch/control';
import { header } from '../batch/header';
import { EntryAddendaFieldKeys, EntryAddendaFields, EntryAddendaOptions, HighLevelAddendaFieldOverrides } from '../entry-addenda/entryAddendaTypes.js';
import { fields as entryAddendaFields } from '../entry-addenda/fields.js';
import { EntryFieldKeys, EntryFields, EntryOptions, HighLevelFieldOverrides } from '../entry/entryTypes.js';
import { fields as entryFields } from '../entry/fields.js';
import nACHError from '../error.js';
import { FileControlKeys, FileControls, FileHeaderKeys, FileHeaders, FileOptions, HighLevelFileOverrides } from '../file/FileTypes.js';
import { fileControls } from '../file/control.js';
import { fileHeaders } from '../file/header.js';
import { highLevelAddendaFieldOverrideSet, highLevelAddendaFieldOverrides, highLevelControlOverrides, highLevelFieldOverrideSet, highLevelFieldOverrides, highLevelFileOverrideSet, highLevelFileOverrides, highLevelHeaderOverrides } from '../overrides.js';
import { compareSets, testRegex } from '../utils.js';

const numericRegex = /^[0-9]+$/;
const alphaRegex = /^[a-zA-Z]+$/;
// eslint-disable-next-line no-useless-escape
const alphanumericRegex = /(^[0-9a-zA-Z!"#$%&'()*+,-.\/:;<>=?@\[\]\\^_`{}|~ ]+$)|(^$)/;

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
  debug = false;

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

  validations = {
    validateRequiredFields:  (object: EntryAddendaFields|EntryFields|BatchHeaders|BatchControls|FileHeaders|FileControls) => {
      Object.keys(object).forEach((k) => {
        const field = (object as EntryAddendaFields)[k as keyof EntryAddendaFields];
        // This check ensures a required field's value is not NaN, null, undefined or empty.
        // Zero is valid, but the data type check will make sure any fields with 0 are numeric.
        if (
            ('required' in field && typeof field.required === 'boolean' && field.required === true)
            && (('value' in field === false) || (!field.value) || field.value.toString().length === 0)
          ) {
          if (this.debug){
            console.debug('[validateRequiredFields::Failed Because]', {
              name: field.name,
              value: field.value,
              required: field.required,
              length: (field.value) ? field.value.toString().length : undefined,
            })
          }
    
          throw new nACHError({
            name: 'Required Field Blank',
            message: `${field.name} is a required field but its value is: ${field.value}`
          });
        }
      });
    
      return true;
    },
    validateRoutingNumber(routing: NumericalString|number) {
      if (typeof routing === 'number') routing = routing.toString() as NumericalString;
    
      // Make sure the routing number is exactly 9-digits long
      if (routing.length !== 9) {
        throw new nACHError({
          name: 'Invalid ABA Number Length',
          message: `The ABA routing number ${routing} is ${routing.length}-digits long, but it should be 9-digits long.`
        });
      }
    
      // Split the routing number into an array of numbers. `array` will look like this: `[2,8,1,0,8,1,4,7,9]`.
      const array = routing.split('').map(Number);
    
      // Validate the routing number (ABA). See here for more info: http://www.brainjar.com/js/validation/
      const sum =
        3 * (array[0] + array[3] + array[6]) +
        7 * (array[1] + array[4] + array[7]) +
        1 * (array[2] + array[5] + array[8]);
    
      // Throw an error if the the result of `sum` modulo 10 is not zero. The value of `sum` must be a multiple of 10 to be a valid routing number.
      if (sum % 10 !== 0) {
        throw new nACHError({
          name: 'Invalid ABA Number',
          message: `The ABA routing number ${routing} is invalid. Please ensure a valid 9-digit ABA routing number is passed.`,
        });
      }
    
      return true;
    },
    validateLengths: (object: EntryAddendaFields|EntryFields|BatchHeaders|BatchControls|FileHeaders|FileControls) => {
      Object.keys(object).forEach((k) => {
        const field = (object as EntryAddendaFields)[k as keyof EntryAddendaFields];
    
        if (field.value.toString().length > field.width) {
          throw new nACHError({
            name: 'Invalid Length',
            message: `${field.name}'s length is ${typeof field.value === 'number' ? field.value.toString().length : field.value.length}, but it should be no greater than ${field.width}.`
          });
        }
      });
    
      return true;
    },
    validateDataTypes(object: EntryAddendaFields|EntryFields|BatchHeaders|BatchControls|FileHeaders|FileControls) {
      Object.keys(object).forEach((k) => {
        const field = (object as EntryAddendaFields)[k as keyof EntryAddendaFields];
    
        if ('blank' in field && field.blank !== true) {
          switch (field.type) {
            case 'numeric': { testRegex(numericRegex, field); break; }
            case 'alpha': { testRegex(alphaRegex, field); break; }
            case 'alphanumeric':{ testRegex(alphanumericRegex, field); break; }
            default: {
              throw new nACHError({
                name: 'Invalid Data Type',
                message: `${field.name}'s data type is required to be ${field.type as string}, but its contents don't reflect that.`
              });
            }
          }
        }
      });
    
      return true;
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

    this.overrideOptions();
  }

  overrideOptions(){
    const { name, overrides, options, typeGuards } = this;

    if (name === 'File'){
      if (('header' in this && 'control' in this)
        && typeGuards.isFileOverrides(overrides)
        && typeGuards.isFileOptions(options)
      ){
        overrides.forEach((field) => {
          if (options[field]) this.set<'File'>(field, options[field]);
        });

        return this;
      }
    }

    if (name === 'Batch'){
      if (('header' in overrides && 'control' in overrides)
        && ('header' in this && 'control' in this)
        && typeGuards.isBatchOptions(options)
      ){
        overrides.header.forEach((field) => {
          if (options[field]) this.set<'Batch', 'header'>(field, options[field] as NonNullable<typeof options[typeof field]>);
        });

        overrides.control.forEach((field) => {
          if (options[field]) this.set<'Batch', 'control'>(field, options[field]);
        });

        return this;
      }

      if (this.debug){
        console.debug('[overrideOptions::Failed Because]', {
          name,
          headerInOverrides: 'header' in overrides,
          controlInOverrides: 'control' in overrides,
          headerInThis: 'header' in this,
          controlInThis: 'control' in this,
          isBatchOptions: typeGuards.isBatchOptions(options),
        })
      }
    }
    

    if (name === 'Entry'){
      if ('fields' in this
      && Array.isArray(overrides)
      && typeGuards.isEntryOverrides(overrides)
      && typeGuards.isEntryOptions(options)){
        overrides.forEach((field) => {
          if (options[field]) this.set<'Entry'>(field, options[field]);
        });

        return this;
      }

      if (this.debug){
        console.debug('[overrideOptions::Failed Because]', {
          name,
          fieldsInThis: 'fields' in this,
          overridesIsArray: Array.isArray(overrides),
          isEntryOverrides: typeGuards.isEntryOverrides(overrides),
          isEntryOptions: typeGuards.isEntryOptions(options),
        })
      }
    }

    if (name === 'EntryAddenda'){
      if ('fields' in this
        && Array.isArray(overrides)
        && typeGuards.isEntryAddendaOverrides(overrides)
        && typeGuards.isEntryAddendaOptions(options)){
        overrides.forEach((field) => {
          if (field in options && options[field] !== undefined) this.set<'EntryAddenda'>(field, options[field] as NonNullable<typeof options[typeof field]>);
        });

        return this;
      }

      if (this.debug){
        console.debug('[overrideOptions::Failed Because]', {
          name,
          fieldsInThis: 'fields' in this,
          overridesIsArray: Array.isArray(overrides),
          isEntryAddendaOverrides: typeGuards.isEntryAddendaOverrides(overrides),
          isEntryAddendaOptions: typeGuards.isEntryAddendaOptions(options),
        })
      }
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

  set<
    Struct extends 'File'|'Batch'|'Entry'|'EntryAddenda',
    BatchCategoryValue extends Struct extends 'EntryAddenda'
      ? undefined : Struct extends 'Entry'
        ? undefined : Struct extends 'Batch'
          ? 'header' | 'control'
          : Struct extends 'File'
            ? 'header' | 'control'
            : never = Struct extends 'EntryAddenda'
              ? undefined : Struct extends 'Entry'
                ? undefined : Struct extends 'Batch'
                  ? 'header' | 'control'
                  : Struct extends 'File'
                    ? 'header' | 'control'
                    : never,
  >(
    field: Struct extends 'EntryAddenda'
      ? EntryAddendaFieldKeys
      : Struct extends 'Entry'
        ? EntryFieldKeys
        : Struct extends 'Batch'
          ? BatchCategoryValue extends 'header'
            ? BatchHeaderKeys
            : BatchCategoryValue extends 'control'
              ? BatchControlKeys
              : never
          : Struct extends 'File'
            ? BatchCategoryValue extends 'header'
              ? FileHeaderKeys
              : BatchCategoryValue extends 'control'
                ? FileControlKeys
                : never
            : never,
        value: Struct extends 'EntryAddenda'
          ? EntryAddendaFields[EntryAddendaFieldKeys]['value']
          : Struct extends 'Entry'
            ? EntryFields[EntryFieldKeys]['value']
            : Struct extends 'Batch'
              ? BatchCategoryValue extends 'header'
                ? BatchHeaders[BatchHeaderKeys]['value']
                : BatchCategoryValue extends 'control'
                  ? BatchControls[BatchControlKeys]['value']
                  : never
              : Struct extends 'File'
                ? BatchCategoryValue extends 'header'
                  ? FileHeaders[FileHeaderKeys]['value']
                  : BatchCategoryValue extends 'control'
                    ? FileControls[FileControlKeys]['value']
                    : never
                : never,
        ) {
          if (!field) return;

          console.log(field, value);
          }
      
}

module.exports = achBuilder;
