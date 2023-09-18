import { NumericalString } from './Types.js';
import type { BatchControls, BatchHeaders, HighLevelControlOverrides, HighLevelHeaderOverrides } from './batch/batchTypes.js';
import { EntryAddendaFields, HighLevelAddendaFieldOverrides } from './entry-addenda/entryAddendaTypes.js';
import type { EntryFields, HighLevelFieldOverrides } from './entry/entryTypes.js';
import { FileControls, FileHeaders } from './file/FileTypes.js';
export declare function deepMerge<Target extends Record<string, unknown> = Record<string, unknown>>(target: Target, ...sources: Array<Record<string, unknown>>): Target;
export declare function addNumericalString(valueStringOne: NumericalString, valueStringTwo: NumericalString): NumericalString;
export declare function pad<Text extends string | number = string, padEnd extends boolean = true, Char extends string = ' '>(str: Text, width: number, padRight?: padEnd, padChar?: Char): string;
export declare function computeCheckDigit(routing: `${number}` | number): `${number}`;
export declare function testRegex(regex: RegExp, field: {
    number?: boolean;
    value: unknown;
    name: string;
    type: string;
}): boolean;
export declare function generateString(object: EntryFields | EntryAddendaFields | BatchHeaders | BatchControls | FileHeaders | FileControls): Promise<string>;
export declare function compareSets(set1: Set<string>, set2: Set<string>): boolean;
type BatchOverrides = Array<HighLevelHeaderOverrides> | Array<HighLevelControlOverrides>;
export declare function isBatchOverrides(arg: BatchOverrides | Array<HighLevelFieldOverrides> | Array<HighLevelAddendaFieldOverrides>): arg is BatchOverrides;
export declare function isBatchHeaderOverrides(arg: Array<HighLevelFieldOverrides> | Array<HighLevelAddendaFieldOverrides> | Array<HighLevelHeaderOverrides> | Array<HighLevelControlOverrides>): arg is Array<HighLevelHeaderOverrides>;
export declare function unique(): number;
export declare function getNextMultiple(value: number, multiple: number): number;
export declare function getNextMultipleDiff(value: number, multiple: number): number;
/**
 *
 * @param dateString
 * @returns
 */
export declare function parseYYMMDD(dateString: `${number}`): Date;
export declare function formatDateToYYMMDD(date: Date): string;
export declare const formatTime: (date: Date) => string;
export declare const isBusinessDay: (day: Date) => boolean;
export declare const computeBusinessDay: (businessDays: number, startingDate?: Date) => Date;
export {};
