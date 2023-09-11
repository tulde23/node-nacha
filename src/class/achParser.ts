import { BatchControlKeys, BatchControls, BatchHeaderKeys, BatchHeaders, BatchOptions, HighLevelControlOverrides, HighLevelHeaderOverrides } from '../batch/batchTypes.js';
import { control } from '../batch/control';
import { header } from '../batch/header';
import { EntryAddendaFieldKeys, EntryAddendaFields, EntryAddendaOptions, HighLevelAddendaFieldOverrides } from '../entry-addenda/entryAddendaTypes.js';
import { fields as entryAddendaFields } from '../entry-addenda/fields.js';
import { EntryFieldKeys, EntryFields, EntryOptions, HighLevelFieldOverrides } from '../entry/entryTypes.js';
import { fields as entryFields } from '../entry/fields.js';
import nACHError from '../error.js';
import { highLevelAddendaFieldOverrides, highLevelControlOverrides, highLevelFieldOverrides, highLevelHeaderOverrides } from '../overrides.js';
import { isBatchOptions, isEntryAddendaOptions, isEntryAddendaOverrides, isEntryOptions, isEntryOverrides } from '../utils.js';

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
    const { name, overrides, options } = this;

    if (name === 'Batch'
    && ('header' in overrides && 'control' in overrides)
    && ('header' in this && 'control' in this)
    && isBatchOptions(options)
    ){
      overrides.header.forEach((field) => {
        if (options[field]) this.set<'Batch', 'header'>(field, options[field] as NonNullable<typeof options[typeof field]>);
      });

      overrides.control.forEach((field) => {
        if (options[field]) this.set<'Batch', 'control'>(field, options[field]);
      });

      return this;
    }

    if (name === 'Entry'
    && 'fields' in this
    && Array.isArray(overrides)
    && isEntryOverrides(overrides)
    && isEntryOptions(options)){
      overrides.forEach((field) => {
        if (options[field]) this.set<'Entry'>(field, options[field]);
      });

      return this;
    }

    if (name === 'EntryAddenda'
    && 'fields' in this
    && Array.isArray(overrides)
    && isEntryAddendaOverrides(overrides)
    && isEntryAddendaOptions(options)){
      overrides.forEach((field) => {
        if (field in options && options[field] !== undefined) this.set<'EntryAddenda'>(field, options[field] as NonNullable<typeof options[typeof field]>);
      });

      return this;
    }
  }

  validateRequiredFields(object: EntryAddendaFields|EntryFields|BatchHeaders|BatchControls) {

    Object.keys(object).forEach((k) => {
      const field = (object as EntryAddendaFields)[k as keyof EntryAddendaFields];
      // This check ensures a required field's value is not NaN, null, undefined or empty.
      // Zero is valid, but the data type check will make sure any fields with 0 are numeric.
      if (
          ('required' in field && typeof field.required === 'boolean' && field.required === true)
          && (('value' in field === false) || (!field.value) || field.value.toString().length === 0)
        ) {
        console.error('[nACH Error]', { field });
  
        throw new nACHError({
          name: 'Required Field Blank',
          message: `${field.name} is a required field but its value is: ${field.value}`
        });
      }
    });
  
    return true;
  }

  get(field: DataStruct extends 'EntryAddenda'
          ? EntryAddendaFieldKeys
          : DataStruct extends 'Entry'
            ? EntryFieldKeys
            : DataStruct extends 'Batch'
              ? (BatchHeaderKeys & BatchControlKeys)
              : never) {
    console.log(field);
  }

  set<
    Struct extends 'Batch'|'Entry'|'EntryAddenda',
    BatchCategoryValue extends Struct extends 'EntryAddenda'
      ? undefined : Struct extends 'Entry'
        ? undefined : Struct extends 'Batch'
          ? 'header' | 'control' : never = Struct extends 'EntryAddenda'
          ? undefined : Struct extends 'Entry'
            ? undefined : Struct extends 'Batch'
              ? 'header'|'control'
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
              : never,
        ) {
          const { name } = this;

          if (!field) return;

          const isAHeaderField = (field: EntryFieldKeys|EntryAddendaFieldKeys|BatchHeaderKeys|BatchControlKeys): field is BatchHeaderKeys => {
            return ('header' in this && this.header !== undefined && Object.keys(this.header).includes(field))
          }

          const isAControlField = (field: EntryFieldKeys|EntryAddendaFieldKeys|BatchHeaderKeys|BatchControlKeys): field is BatchControlKeys => {
            return ('control' in this && this.control !== undefined && Object.keys(this.control).includes(field))
          }

          const isAEntryField = (field: EntryFieldKeys|EntryAddendaFieldKeys|BatchHeaderKeys|BatchControlKeys): field is EntryFieldKeys => {
            return ('fields' in this && this.fields !== undefined && Object.keys(this.fields).includes(field))
          }

          const isAEntryAddendaField = (field: EntryFieldKeys|EntryAddendaFieldKeys|BatchHeaderKeys|BatchControlKeys): field is EntryAddendaFieldKeys => {
            return ('fields' in this && this.fields !== undefined && Object.keys(this.fields).includes(field))
          }

          const controlIsBatchControls = (controls: BatchControls|BatchHeaders): controls is BatchControls => {
            return (
              'control' in this
              && this.control !== undefined
              && (Object.keys(this.control).includes('recordTypeCode')
                && Object.keys(this.control).includes(Object.keys(controls)[Object.keys(controls).length - 1]))
            )
          }

          const fieldsIsEntryFields = (fields: EntryFields|EntryAddendaFields): fields is EntryFields => {
            return (
              'fields' in this
              && this.fields !== undefined
              && (Object.keys(this.fields).includes('transactionCode')
                && Object.keys(this.fields).includes(Object.keys(fields)[Object.keys(fields).length - 1]))
            )
          }

          const fieldsIsEntryAddendaFields = (fields: EntryFields|EntryAddendaFields): fields is EntryAddendaFields => {
            return (
              'fields' in this
              && this.fields !== undefined
              && (Object.keys(this.fields).includes('recordTypeCode')
                && Object.keys(this.fields).includes(Object.keys(fields)[Object.keys(fields).length - 1]))
            )
          }

            if (name === 'Batch'
              && ('header' in this && 'control' in this)
              && (this.header !== undefined && this.control !== undefined)
              && controlIsBatchControls(this.control)
            ){ // If the header has the field, set the value
              if (isAHeaderField(field) && field in this.header) {
                if (field === 'serviceClassCode'){
                  this.header[field satisfies 'serviceClassCode'].value = value as `${number}`
                } else {
                  this.header[field satisfies BatchHeaderKeys].value = value as string|number;
                }
              }

              // If the control has the field, set the value
              if (isAControlField(field) && field in this.control) {
                this.control[field satisfies BatchControlKeys].value = value;
              }

              return this;
            }

            if (name === 'Entry'
              && ('fields' in this && this.fields !== undefined)
              && fieldsIsEntryFields(this.fields)
              && isAEntryField(field)
            ){
              // If the entry has the field, set the value
              this.fields[field satisfies EntryFieldKeys].value = value as string|number;

              return this;
            }

            if (name === 'EntryAddenda'
              && ('fields' in this && this.fields !== undefined)
              && fieldsIsEntryAddendaFields(this.fields)
              && isAEntryAddendaField(field)
            ){
              if (field === 'entryDetailSequenceNumber' && value) {
                this.fields.entryDetailSequenceNumber.value = Number(value.toString().slice(0 - this.fields.entryDetailSequenceNumber.width)); // pass last n digits
              } else {
                this.fields[field satisfies EntryAddendaFieldKeys].value = value as string|number;
              }

              return this;
            }
          }
      
}

module.exports = achBuilder;
