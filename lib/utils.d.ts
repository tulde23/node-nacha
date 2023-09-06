import { BatchOptions, EntryOptions, HighLevelControlOverrides, HighLevelFieldOverrides, HighLevelHeaderOverrides } from './Types.js';
import Batch from './batch/index.js';
import Entry from './entry/index.js';
export declare function pad<Text extends string = string, padEnd extends boolean = true, Char extends string = ' '>(str: Text, width: number, padRight?: padEnd, padChar?: Char): string;
export declare function computeCheckDigit(routing: `${number}` | number): `${number}`;
export declare function testRegex(regex: RegExp, field: {
    number: number | string;
    value: string;
    name: string;
    type: string;
}): boolean;
export declare function generateString(object: Record<string, unknown>, cb: (arg0: string) => void): void;
export declare function parseLine(str: string, object: Record<string, {
    width: number;
}>): Record<string, string>;
export declare function compareSets(set1: Set<string>, set2: Set<string>): boolean;
type BatchOverrides = Array<HighLevelHeaderOverrides> | Array<HighLevelControlOverrides>;
export declare function overrideLowLevel(values: BatchOverrides, options: BatchOptions, self: Batch): void;
export declare function overrideLowLevel(values: Array<HighLevelFieldOverrides>, options: EntryOptions, self: Entry): void;
export declare function unique(): number;
export declare function getNextMultiple(value: number, multiple: number): number;
export declare function getNextMultipleDiff(value: number, multiple: number): number;
export declare const formatDate: (date: Date) => string;
export declare const formatTime: (date: Date) => string;
export declare const isBusinessDay: (day: Date) => boolean;
export declare const computeBusinessDay: (businessDays: number, startingDate?: Date) => Date;
export declare function newLineChar(): string;
export {};
