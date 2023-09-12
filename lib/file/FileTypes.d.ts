import { CamelToTitleCase, BaseFieldParams, NumericalString } from '../Types.js';
export type HighLevelFileOverrides = 'immediateDestination' | 'immediateOrigin' | 'fileCreationDate' | 'fileCreationTime' | 'fileIdModifier' | 'immediateDestinationName' | 'immediateOriginName' | 'referenceCode';
export type FileHeaderKeys = 'recordTypeCode' | 'priorityCode' | 'immediateDestination' | 'immediateOrigin' | 'fileCreationDate' | 'fileCreationTime' | 'fileIdModifier' | 'recordSize' | 'blockingFactor' | 'formatCode' | 'immediateDestinationName' | 'immediateOriginName' | 'referenceCode';
type FileHeaderKeysWithStringFields = "immediateDestination" | "immediateOrigin" | "fileCreationDate" | "fileCreationTime" | "fileIdModifier" | "immediateDestinationName" | "immediateOriginName" | "referenceCode";
type FileHeaderKeysWithNumericalStringFields = "recordTypeCode" | "priorityCode" | "recordSize" | "blockingFactor" | "formatCode";
type FileHeaderField<Key extends FileHeaderKeys = FileHeaderKeys> = {
    name: CamelToTitleCase<Key>;
    paddingChar?: string;
} & BaseFieldParams;
export type FileHeaderFieldWithString<Key extends FileHeaderKeysWithStringFields = FileHeaderKeysWithStringFields> = FileHeaderField<Key> & {
    value: string;
};
export type FileHeaderFieldWithNumericalString<Key extends FileHeaderKeysWithNumericalStringFields = FileHeaderKeysWithNumericalStringFields> = FileHeaderField<Key> & {
    value: NumericalString;
};
export type FileHeaders = {
    [key in FileHeaderKeysWithStringFields]: FileHeaderFieldWithString<key>;
} & {
    [key in FileHeaderKeysWithNumericalStringFields]: FileHeaderFieldWithNumericalString<key>;
};
export type FileControlKeys = 'recordTypeCode' | 'addendaCount' | 'entryHash' | 'totalDebit' | 'totalCredit' | 'batchCount' | 'blockCount' | 'reserved';
type FileControlKeysWithStringFields = 'reserved';
type FileControlKeysWithNumericalStringFields = 'recordTypeCode';
type FileControlKeysWithNumberFields = 'addendaCount' | 'entryHash' | 'totalDebit' | 'totalCredit' | 'batchCount' | 'blockCount';
type FileControlField<Key extends FileControlKeys = FileControlKeys> = {
    name: CamelToTitleCase<Key> | string;
    number?: boolean;
} & {
    width: number;
    position: number;
    type: 'numeric' | 'alphanumeric' | 'alpha' | 'ABA';
};
export type FileControlFieldWithString<Key extends FileControlKeysWithStringFields = FileControlKeysWithStringFields> = FileControlField<Key> & {
    value: string;
    blank: boolean;
};
export type FileControlFieldWithNumericalString<Key extends FileControlKeysWithNumericalStringFields = FileControlKeysWithNumericalStringFields> = FileControlField<Key> & {
    value: NumericalString;
};
export type FileControlFieldWithNumber<Key extends FileControlKeysWithNumberFields = FileControlKeysWithNumberFields> = FileControlField<Key> & {
    value: number;
};
export type FileControls = {
    reserved: FileControlFieldWithString<'reserved'>;
    recordTypeCode: FileControlFieldWithNumericalString<'recordTypeCode'>;
} & {
    [key in FileControlKeysWithNumberFields]: FileControlFieldWithNumber<key>;
};
export type FileOptions = {
    header?: FileHeaders;
    control?: FileControls;
    immediateDestination: NumericalString;
    immediateOrigin: string;
    batchSequenceNumber?: number;
} & {
    [key in HighLevelFileOverrides]?: string | number;
};
export {};
