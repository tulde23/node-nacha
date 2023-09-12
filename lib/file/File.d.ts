import { FileControls, FileHeaders, FileOptions } from './FileTypes.js';
import Batch from '../batch/Batch.js';
import achBuilder from '../class/achParser.js';
export default class File extends achBuilder<'File'> {
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
    parseLine(str: string, object: Record<string, Record<string, unknown> & {
        width: number;
    }>): Record<string, string>;
    parse(str: string): Promise<File>;
    isAHeaderField(field: keyof FileHeaders | keyof FileControls): field is keyof FileHeaders;
    isAControlField(field: keyof FileHeaders | keyof FileControls): field is keyof FileControls;
    get<Field extends keyof FileHeaders | keyof FileControls = keyof FileHeaders>(field: Field): Field extends keyof FileHeaders ? typeof this.header[Field]['value'] : string | number;
    set<Key extends keyof FileHeaders | keyof FileControls = keyof FileHeaders>(field: Key, value: typeof field extends keyof FileHeaders ? typeof this.header[Key]['value'] : typeof field extends keyof FileControls ? typeof this.control[Key]['value'] : never): string | number | undefined;
}
