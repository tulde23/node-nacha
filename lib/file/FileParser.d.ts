import File from './File.js';
export default class NACHParser {
    /**
     * @param {string} filePath
     * @param {boolean} debug
     * @returns {Promise<File>}
     */
    static parseFile(filePath: string, debug?: boolean): Promise<File>;
    static parse(str: string, debug: boolean): Promise<File>;
}
