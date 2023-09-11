import { NumericalString } from './Types.js';
import type { HighLevelHeaderOverrides, HighLevelControlOverrides, BatchOptions, BatchControls, BatchHeaders } from './batch/batchTypes.js';
import { EntryAddendaFields, EntryAddendaOptions, HighLevelAddendaFieldOverrides } from './entry-addenda/entryAddendaTypes.js';
import type { HighLevelFieldOverrides, EntryOptions, EntryFields } from './entry/entryTypes.js';
export declare function addNumericalString(valueStringOne: NumericalString, valueStringTwo: NumericalString): NumericalString;
export declare function pad<Text extends string | number = string, padEnd extends boolean = true, Char extends string = ' '>(str: Text, width: number, padRight?: padEnd, padChar?: Char): string;
export declare function computeCheckDigit(routing: `${number}` | number): `${number}`;
export declare function testRegex(regex: RegExp, field: {
    number?: boolean;
    value: unknown;
    name: string;
    type: string;
}): boolean;
export declare function generateString(object: EntryFields | EntryAddendaFields | BatchHeaders | BatchControls): string;
export declare function parseLine(str: string, object: Record<string, {
    width: number;
}>): Record<string, string>;
export declare function compareSets(set1: Set<string>, set2: Set<string>): boolean;
type BatchOverrides = Array<HighLevelHeaderOverrides> | Array<HighLevelControlOverrides>;
type BatchOverrideRecord = {
    header: Array<HighLevelHeaderOverrides>;
    control: Array<HighLevelControlOverrides>;
};
export declare function isBatchOverrides(arg: BatchOverrides | Array<HighLevelFieldOverrides> | Array<HighLevelAddendaFieldOverrides>): arg is BatchOverrides;
export declare function isBatchHeaderOverrides(arg: Array<HighLevelFieldOverrides> | Array<HighLevelAddendaFieldOverrides> | Array<HighLevelHeaderOverrides> | Array<HighLevelControlOverrides>): arg is Array<HighLevelHeaderOverrides>;
export declare function isBatchOptions(arg: BatchOptions | EntryOptions | EntryAddendaOptions): arg is BatchOptions;
export declare function isEntryOverrides(arg: BatchOverrides | BatchOverrideRecord | Array<HighLevelFieldOverrides> | Array<HighLevelAddendaFieldOverrides>): arg is Array<HighLevelFieldOverrides>;
export declare function isEntryAddendaOverrides(arg: BatchOverrides | BatchOverrideRecord | Array<HighLevelFieldOverrides> | Array<HighLevelAddendaFieldOverrides>): arg is Array<HighLevelAddendaFieldOverrides>;
export declare function isEntryAddendaOptions(arg: BatchOptions | EntryOptions | EntryAddendaOptions): arg is EntryAddendaOptions;
export declare function unique(): number;
export declare function getNextMultiple(value: number, multiple: number): number;
export declare function getNextMultipleDiff(value: number, multiple: number): number;
export declare const formatDate: (date: Date) => string;
export declare const formatTime: (date: Date) => string;
export declare const isBusinessDay: (day: Date) => boolean;
export declare const computeBusinessDay: (businessDays: number, startingDate?: Date) => Date;
export declare function newLineChar(): string;
export {};
