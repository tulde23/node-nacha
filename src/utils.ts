import { NumericalString } from './Types.js';
import type { BatchControls, BatchHeaderKeys, BatchHeaders, BatchOptions, HighLevelControlOverrides, HighLevelHeaderOverrides } from './batch/batchTypes.js';
import { EntryAddendaFieldKeys, EntryAddendaFields, EntryAddendaOptions, HighLevelAddendaFieldOverrides } from './entry-addenda/entryAddendaTypes.js';
import type { EntryFieldKeys, EntryFields, EntryOptions, HighLevelFieldOverrides } from './entry/entryTypes.js';
import nACHError from './error';
import { FileControls, FileHeaders } from './file/FileTypes.js';
import { highLevelControlOverrideSet, highLevelHeaderOverrideSet } from './overrides.js';
let counter = 0;

export function addNumericalString(valueStringOne: NumericalString, valueStringTwo: NumericalString): NumericalString {
  return valueStringOne + valueStringTwo as NumericalString;
}

// Pad a given string to a fixed width using any character or number (defaults to one blank space)
// Both a string and width are required params for this function, but it also takes two optional
// parameters. First, a boolean called 'padRight' which by default is true. This means padding 
// will be applied to the right side of the string. Setting this to false will pad the left side of the
// string. You can also specify the character you want to use to pad the string.
export function pad<Text extends string|number = string, padEnd extends boolean = true, Char extends string = ' '>(
  str: Text, width: number, padRight: padEnd = true as padEnd, padChar: Char = ' ' as Char
  ) {
  if (typeof str === 'number') str = str.toString() as Text;
  if (typeof str !== 'string') throw new TypeError('pad() requires a string or number to pad');
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

  const value = a.length !== 8
    ? routing
    : routing + (7 * (a[0] + a[3] + a[6]) + 3 * (a[1] + a[4] + a[7]) + 9 * (a[2] + a[5])) % 10 as `${number}`;

    return value;
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

export function generateString(object: EntryFields|EntryAddendaFields|BatchHeaders|BatchControls|FileHeaders|FileControls): string {
  let counter = 1;
  let result = '';
  const objectCount = Object.keys(object).length;

  while (counter < objectCount) {
    Object.values(object).forEach((field: EntryFields[EntryFieldKeys]|EntryAddendaFields[EntryAddendaFieldKeys]|BatchHeaders[BatchHeaderKeys]) => {
      if (field.position === counter) {
        if (field.value && (('blank' in field && field.blank === true) || field.type === 'alphanumeric')) {
          result = result + pad(field.value, field.width);
        } else {
          const string = ('number' in field && field.number)
            ? parseFloat(field.value as string).toFixed(2).replace(".", "")
            : field.value as string;

          const paddingChar = ('paddingChar' in field) ? field.paddingChar : '0';

          result = result + pad(string, field.width, false, paddingChar);
        }
        counter++;
      }
    });
  }
  
  return result;
}

export function compareSets(set1: Set<string>, set2: Set<string>) {
  if (set1.size !== set2.size) return false;

  for (const item of set1) {
    if (!set2.has(item)) return false;
  }

  return true;
}

type BatchOverrides = Array<HighLevelHeaderOverrides>|Array<HighLevelControlOverrides>

export function isBatchOverrides(arg: BatchOverrides|Array<HighLevelFieldOverrides>|Array<HighLevelAddendaFieldOverrides>): arg is BatchOverrides {
  return compareSets(new Set(arg), highLevelHeaderOverrideSet)
      || compareSets(new Set(arg), highLevelControlOverrideSet);
}

export function isBatchHeaderOverrides(
  arg: Array<HighLevelFieldOverrides>|Array<HighLevelAddendaFieldOverrides>|Array<HighLevelHeaderOverrides>|Array<HighLevelControlOverrides>
  ): arg is Array<HighLevelHeaderOverrides> {
  return compareSets(new Set(arg), highLevelHeaderOverrideSet);
}

export function isEntryAddendaOptions(arg: BatchOptions|EntryOptions|EntryAddendaOptions): arg is EntryAddendaOptions {
  if (typeof arg !== 'object') return false;
  if (Object.keys(arg).length === 0) return false;
  if ('fields' in arg) return true;

  return false;
}

export function unique() { return counter++; }

export function getNextMultiple(value: number, multiple: number) {
  return value % multiple == 0 ? value : value + (multiple - value % multiple);
}

export function getNextMultipleDiff(value: number, multiple: number) {
  return (getNextMultiple(value, multiple) - value);
}

export function parseYYMMDD(dateString: string) {
  const year = dateString.slice(0, 2);
  const month = dateString.slice(2, 4);
  const day = dateString.slice(4, 6);
  const date = new Date(`20${year}-${month}-${day}`);
  date.setHours(date.getHours() + 12) // Keeps it from converting back as a day behind

  return date;
}

// This allows us to create a valid ACH date in the YYMMDD format
export function formatDateToYYMMDD(date: Date){
  const year = date.getFullYear().toString().substr(2, 4);
  const month = ((date.getMonth() + 1) < 10) // months are numbered 0-11 in JavaScript
    ? `0${(date.getMonth() + 1)}`
    : (date.getMonth() + 1).toString();

  const day = (date.getDate() < 10)
    ? `0${date.getDate()}`
    : date.getDate().toString();
 
  return `${year + month.toString() + day}`
}

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

// This function takes an optional starting date to iterate from based on the number of business days provided.
export const computeBusinessDay = function(businessDays: number, startingDate?: Date): Date {
  const date = startingDate || new Date();
  let days = 0;

  while (days < businessDays) {
    date.setDate(date.getDate() + 1);
    if (isBusinessDay(date)) days++;
  }

  return date;
};

module.exports = {
  addNumericalString,
  isBatchHeaderOverrides,
  isEntryAddendaOptions,
  compareSets,
  pad,
  unique,
  testRegex,
  parseYYMMDD,
  formatDateToYYMMDD,
  formatTime,
  generateString,
  getNextMultiple,
  computeCheckDigit,
  computeBusinessDay,
  getNextMultipleDiff,
}
