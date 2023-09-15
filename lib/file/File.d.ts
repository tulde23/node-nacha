import Batch from '../batch/Batch.js';
import achBuilder from '../class/achParser.js';
import { FileControls, FileHeaders, FileOptions, HighLevelFileOverrides } from './FileTypes.js';
export default class File extends achBuilder<'File'> {
    overrides: HighLevelFileOverrides[];
    header: FileHeaders;
    control: FileControls;
    private _batches;
    private _batchSequenceNumber;
    constructor(options: FileOptions, autoValidate?: boolean, debug?: boolean);
    private validate;
    addBatch(batch: Batch): void;
    getBatches(): Batch[];
    generatePaddedRows(rows: number): string;
    generateHeader(): string;
    generateControl(): string;
    generateBatches(): {
        result: string;
        rows: number;
    };
    generateFile(): Promise<string>;
    writeFile(path: string): Promise<void>;
    static parseFile(filePath: string, debug?: boolean): Promise<File>;
    static parse(str: string, debug: boolean): Promise<File>;
    isAHeaderField(field: keyof FileHeaders | keyof FileControls): field is keyof FileHeaders;
    isAControlField(field: keyof FileHeaders | keyof FileControls): field is keyof FileControls;
    get<Field extends keyof FileHeaders | keyof FileControls = keyof FileHeaders>(field: Field): (Field extends ("immediateDestination" | "immediateOrigin" | "fileCreationDate" | "fileCreationTime" | "fileIdModifier" | "immediateDestinationName" | "immediateOriginName" | "referenceCode") | ("recordTypeCode" | "priorityCode" | "recordSize" | "blockingFactor" | "formatCode") ? FileHeaders[Field]["value"] : never) | (Field extends "recordTypeCode" | "reserved" | ("addendaCount" | "entryHash" | "totalDebit" | "totalCredit" | "batchCount" | "blockCount") ? FileControls[Field]["value"] : never);
    set<Key extends keyof FileHeaders | keyof FileControls = keyof FileHeaders>(field: Key, value: string | number): string | number | undefined;
}
