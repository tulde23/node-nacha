import Batch from '../batch/Batch.js';
import { FileControls, FileHeaders, FileOptions, HighLevelFileOverrides } from './FileTypes.js';
export default class File {
    options: FileOptions;
    overrides: Array<HighLevelFileOverrides>;
    header: FileHeaders;
    control: FileControls;
    private batches;
    private batchSequenceNumber;
    debug: boolean;
    /**
     *
     * @param {FileOptions} options
     * @param {boolean} autoValidate
     * @param {boolean} debug
     */
    constructor(options: FileOptions, autoValidate?: boolean, debug?: boolean);
    private validate;
    addBatch(batch: Batch): void;
    getBatches(): Batch[];
    generatePaddedRows(rows: number): string;
    generateHeader(): Promise<string>;
    generateControl(): Promise<string>;
    generateBatches(): Promise<{
        result: string;
        rows: number;
    }>;
    generateFile(): Promise<string>;
    writeFile(path: string): Promise<void>;
    isAHeaderField(field: keyof FileHeaders | keyof FileControls): field is keyof FileHeaders;
    isAControlField(field: keyof FileHeaders | keyof FileControls): field is keyof FileControls;
    get<Field extends keyof FileHeaders | keyof FileControls = keyof FileHeaders>(field: Field): (Field extends ("immediateDestination" | "immediateOrigin" | "fileCreationDate" | "fileCreationTime" | "fileIdModifier" | "immediateDestinationName" | "immediateOriginName" | "referenceCode") | ("recordTypeCode" | "priorityCode" | "recordSize" | "blockingFactor" | "formatCode") ? FileHeaders[Field]["value"] : never) | (Field extends "recordTypeCode" | "reserved" | ("addendaCount" | "entryHash" | "totalDebit" | "totalCredit" | "batchCount" | "blockCount") ? FileControls[Field]["value"] : never);
    set<Key extends keyof FileHeaders | keyof FileControls = keyof FileHeaders>(field: Key, value: string | number): string | number | undefined;
}
