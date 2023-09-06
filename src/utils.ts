import type { HighLevelHeaderOverrides, HighLevelControlOverrides, BatchOptions } from './batch/batchTypes.js';
import Batch from './batch/index.js';
import { EntryAddendaOptions, HighLevelAddendaFieldOverrides } from './entry-addenda/entryAddendaTypes.js';
import EntryAddenda from './entry-addenda/index.js';
import type { HighLevelFieldOverrides, EntryOptions } from './entry/entryTypes.js';
import Entry from './entry/index.js';
import nACHError from './error';
import { highLevelAddendaFieldOverrideSet, highLevelControlOverrideSet, highLevelFieldOverrideSet, highLevelHeaderOverrideSet } from './overrides.js';
let counter = 0;

// Pad a given string to a fixed width using any character or number (defaults to one blank space)
// Both a string and width are required params for this function, but it also takes two optional
// parameters. First, a boolean called 'padRight' which by default is true. This means padding 
// will be applied to the right side of the string. Setting this to false will pad the left side of the
// string. You can also specify the character you want to use to pad the string.
export function pad<Text extends string = string, padEnd extends boolean = true, Char extends string = ' '>(
  str: Text, width: number, padRight: padEnd = true as padEnd, padChar: Char = ' ' as Char
  ) {
  if (str.length >= width) {
    return str;
  } else {
    return padRight
      ? str.padEnd(width, padChar)
      : str.padStart(width, padChar);
  }
}

export function computeCheckDigit(routing: `${number}`|number): `${number}` {
  if (typeof routing === 'number') routing = routing.toString() as `${number}`;
  const a = routing.split('').map(Number);

  return a.length !== 8
    ? routing
    : routing + (7 * (a[0] + a[3] + a[6]) + 3 * (a[1] + a[4] + a[7]) + 9 * (a[2] + a[5])) % 10 as `${number}`;
}

// This function is passed a field and a regex and tests the field's value property against the given regex
export function testRegex(regex: RegExp, field: { number?: boolean; value: unknown; name: string; type: string; }) {
  const string: string = field.number
  ? parseFloat(field.value as string).toFixed(2).replace(/\./, '')
  : field.value as string;

  if (!regex.test(string)) {
    throw new nACHError({
      name: 'Invalid Data Type',
      message: `${field.name}'s data type is required to be ${field.type}, but its contents don't reflect that.`
    });
  }

  return true;
}

// This function iterates through the object passed in and checks to see if it has a "position" property. If so, we pad it, and then concatenate it where belongs.
export function generateString(object: Record<string, unknown>, cb: (arg0: string) => void) {
  let result = '';

  Object.keys(object).forEach(key => {
    const field = object[key] as { position: number; blank: boolean; type: string; value: string; width: number; number: number; paddingChar: string; };

    if (field.position) {
      if (field.blank === true || field.type == 'alphanumeric') {
        result = result + pad(field.value, field.width);
      } else {
        const string = field.number ? parseFloat(field.value).toFixed(2).replace(/\./, '') : field.value;
        const paddingChar = field.paddingChar || '0';
        result = result + pad(string, field.width, false, paddingChar);
      }
    }
  });

  cb(result);
}

export function parseLine(str: string, object: Record<string, { width: number; }>) {
 // Rewrite in Modern JS
 let pos = 0;

 return Object.keys(object).reduce((result: Record<string, string>, key: keyof typeof object) => {
    const field = object[key];
    result[key] = str.substring(pos, field.width).trim();
    pos += field.width;
    return result;
 }, {});
}

export function compareSets(set1: Set<string>, set2: Set<string>) {
  if (set1.size !== set2.size) return false;

  for (const item of set1) {
    if (!set2.has(item)) return false;
  }

  return true;
}

type BatchOverrides = Array<HighLevelHeaderOverrides>|Array<HighLevelControlOverrides>

function isBatchOverrides(arg: BatchOverrides|Array<HighLevelFieldOverrides>|Array<HighLevelAddendaFieldOverrides>): arg is BatchOverrides {
  return compareSets(new Set(arg), highLevelHeaderOverrideSet)
      || compareSets(new Set(arg), highLevelControlOverrideSet);
}

function isBatchOptions(arg: BatchOptions|EntryOptions|EntryAddendaOptions): arg is BatchOptions {
  if (typeof arg !== 'object') return false;
  if (Object.keys(arg).length === 0) return false;
  if ('header' in arg && 'control' in arg && 'originatingDFI' in arg) return true;

  return false;
}

function isEntryOverrides(arg: BatchOverrides|Array<HighLevelFieldOverrides>|Array<HighLevelAddendaFieldOverrides>): arg is Array<HighLevelFieldOverrides> {
  return compareSets(new Set(arg), highLevelFieldOverrideSet);
}

function isEntryOptions(arg: BatchOptions|EntryOptions|EntryAddendaOptions): arg is EntryOptions {
  if (typeof arg !== 'object') return false;
  if (Object.keys(arg).length === 0) return false;
  if ('fields' in arg){
    if ('amount' in arg.fields) return true;
  }

  return false;
}

function isEntryAddendaOverrides(arg: BatchOverrides|Array<HighLevelFieldOverrides>|Array<HighLevelAddendaFieldOverrides>): arg is Array<HighLevelAddendaFieldOverrides> {
  return compareSets(new Set(arg), highLevelAddendaFieldOverrideSet);
}

function isEntryAddendaOptions(arg: BatchOptions|EntryOptions|EntryAddendaOptions): arg is EntryAddendaOptions {
  if (typeof arg !== 'object') return false;
  if (Object.keys(arg).length === 0) return false;
  if ('fields' in arg) return true;

  return false;
}

export function overrideLowLevel(values: BatchOverrides, options: BatchOptions, self: Batch): void
export function overrideLowLevel(values: Array<HighLevelFieldOverrides>, options: EntryOptions, self: Entry): void
export function overrideLowLevel(values: Array<HighLevelAddendaFieldOverrides>, options: EntryAddendaOptions, self: EntryAddenda): void
export function overrideLowLevel(
  values: BatchOverrides|Array<HighLevelFieldOverrides>|Array<HighLevelAddendaFieldOverrides>,
  options: BatchOptions|EntryOptions|EntryAddendaOptions,
  self: Batch|Entry|EntryAddenda
): void {
  if (!Array.isArray(values)) throw new Error('overrideLowLevel() requires an array of values to override');
  if (typeof options !== 'object') throw new Error('overrideLowLevel() requires an object of options to override');
  if (typeof self !== 'object') throw new Error('overrideLowLevel() requires an object to override');

  if (values.length === 0) return;
  if (Object.keys(options).length === 0) return;
  if (Object.keys(self).length === 0) return;

  if (isBatchOverrides(values) && isBatchOptions(options) && self instanceof Batch) {
    // For each override value, check to see if it exists on the options object & if so, set it
    values.forEach((field) => {
      if (options[field]) self.set(field, options[field] as string|number);
    });
  }
  
  if (isEntryOverrides(values) && isEntryOptions(options) && self instanceof Entry) {
    values.forEach((field) => {
      if (options[field]) self.set(field, options[field] as string);
    });
  }

  if (isEntryAddendaOverrides(values) && isEntryAddendaOptions(options) && self instanceof EntryAddenda) {
    values.forEach((field) => {
      if (options[field]) self.set(field, options[field] as string);
    });
  }
}

export function unique() { return counter++; }

export function getNextMultiple(value: number, multiple: number) {
  return value % multiple == 0 ? value : value + (multiple - value % multiple);
}

export function getNextMultipleDiff(value: number, multiple: number) {
  return (getNextMultiple(value, multiple) - value);
}

// This allows us to create a valid ACH date in the YYMMDD format
export const formatDate = function(date: Date) {
  const year = pad(date.getFullYear().toString().slice(-2), 2, false, '0');
  const month = pad((date.getMonth() + 1).toString(), 2, false, '0');
  const day = pad(date.getDate().toString(), 2, false, '0');

  return year + month + day;
};

// Create a valid timestamp used by the ACH system in the HHMM format
export const formatTime = function(date: Date) {
  const hour = date.getHours().toString();
  const minute = date.getMinutes().toString();

  return pad(hour, 2, false, '0') + pad(minute, 2, false, '0');
};

export const isBusinessDay = function(day: Date) {
  const d = new Date(day).getDay();
  return (d !== 0 && d !== 6) ? true : false;
};

// This function takes an optional starting date to iterate from based
// on the number of business days provided.
export const computeBusinessDay = function(businessDays: number, startingDate?: Date): Date {
  const date = startingDate || new Date();
  let days = 0;

  while (days < businessDays) {
    date.setDate(date.getDate() + 1);
    if (isBusinessDay(date)) days++;
  }

  return date;
};

export function newLineChar() { return '\r\n'; }

module.exports = {
  pad,
  unique,
  testRegex: testRegex,
  formatDate,
  formatTime,
  newLineChar,
  generateString,
  parseLine,
  getNextMultiple,
  overrideLowLevel,
  computeCheckDigit,
  computeBusinessDay,
  getNextMultipleDiff: getNextMultipleDiff,
}
