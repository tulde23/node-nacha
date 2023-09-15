"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const Batch_js_1 = __importDefault(require("../batch/Batch.js"));
const control_js_1 = require("../batch/control.js");
const header_js_1 = require("../batch/header.js");
const EntryAddenda_js_1 = __importDefault(require("../entry-addenda/EntryAddenda.js"));
const fields_js_1 = require("../entry-addenda/fields.js");
const Entry_js_1 = __importDefault(require("../entry/Entry.js"));
const fields_js_2 = require("../entry/fields.js");
const File_js_1 = __importDefault(require("./File.js"));
const control_js_2 = require("./control.js");
const header_js_2 = require("./header.js");
class NACHParser {
    /**
     * @param {string} filePath
     * @param {boolean} debug
     * @returns {Promise<File>}
     */
    static parseFile(filePath, debug = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield (0, promises_1.readFile)(filePath, { encoding: 'utf-8' });
                const file = yield this.parse(data, debug);
                if (!file)
                    throw new Error('File could not be parsed');
                return file;
            }
            catch (err) {
                console.error('[node-natcha::File:parseFile] - Error', err);
                throw err;
            }
        });
    }
    static parse(str, debug) {
        const parseLine = (str, object) => {
            let pos = 0;
            return Object.keys(object).reduce((result, key) => {
                const field = object[key];
                result[key] = str.substring(pos, pos + field.width).trim();
                pos += field.width;
                return result;
            }, {});
        };
        return new Promise((resolve, reject) => {
            if (!str || !str.length) {
                reject('Input string is empty');
                return;
            }
            let lines = str.split('\n');
            if (lines.length <= 1) {
                lines = [];
                for (let i = 0; i < str.length; i += 94) {
                    lines.push(str.substr(i, 94));
                }
            }
            const file = {};
            const batches = [];
            let batchIndex = 0;
            let hasAddenda = false;
            lines.forEach((line) => {
                try {
                    if (!line || !line.length)
                        return;
                    line = line.trim();
                    const lineType = parseInt(line[0]);
                    if (lineType === 1)
                        file.header = parseLine(line, header_js_2.fileHeaders);
                    if (lineType === 9)
                        file.control = parseLine(line, control_js_2.fileControls);
                    if (lineType === 5) {
                        batches.push({
                            header: parseLine(line, header_js_1.header),
                            entry: [],
                        });
                    }
                    if (lineType === 8) {
                        batches[batchIndex].control = parseLine(line, control_js_1.control);
                        batchIndex++;
                    }
                    if (lineType === 6) {
                        batches[batchIndex].entry.push(new Entry_js_1.default(parseLine(line, fields_js_2.fields), undefined, debug));
                    }
                    if (lineType === 7) {
                        batches[batchIndex]
                            .entry[batches[batchIndex].entry.length - 1]
                            .addAddenda(new EntryAddenda_js_1.default(parseLine(line, fields_js_1.fields), undefined, debug));
                        hasAddenda = true;
                    }
                }
                catch (error) {
                    console.error('[node-natcha::File:parse] - Error', error);
                    reject(error);
                }
            });
            if (!file.header) {
                reject('File header missing or not parsable error');
                return;
            }
            if (!file.control) {
                reject('File control missing or not parsable error');
                return;
            }
            if (!batches.length) {
                reject('No batches found');
                return;
            }
            try {
                const nachFile = new File_js_1.default(file.header, !hasAddenda, debug);
                batches.forEach((batchOb) => {
                    const batch = new Batch_js_1.default(batchOb.header, undefined, debug);
                    batchOb.entry.forEach((entry) => {
                        batch.addEntry(entry);
                    });
                    nachFile.addBatch(batch);
                });
                resolve(nachFile);
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.default = NACHParser;
module.exports = NACHParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZVBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9maWxlL0ZpbGVQYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBdUM7QUFDdkMsaUVBQXNDO0FBRXRDLG9EQUErRDtBQUMvRCxrREFBNEQ7QUFDNUQsdUZBQTREO0FBQzVELDBEQUFxRTtBQUNyRSxpRUFBc0M7QUFFdEMsa0RBQTJEO0FBQzNELHdEQUE2QjtBQUU3Qiw2Q0FBNEM7QUFDNUMsMkNBQTBDO0FBRTFDLE1BQXFCLFVBQVU7SUFDN0I7Ozs7T0FJRztJQUNILE1BQU0sQ0FBTyxTQUFTLENBQUMsUUFBZ0IsRUFBRSxRQUFpQixLQUFLOztZQUM3RCxJQUFJO2dCQUNGLE1BQU0sSUFBSSxHQUFHLE1BQU0sSUFBQSxtQkFBUSxFQUFDLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RCxNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsSUFBSTtvQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7Z0JBQ3ZELE9BQU8sSUFBSSxDQUFDO2FBQ2I7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDWixPQUFPLENBQUMsS0FBSyxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLEdBQUcsQ0FBQzthQUNYO1FBQ0gsQ0FBQztLQUFBO0lBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFXLEVBQUUsS0FBYztRQUN0QyxNQUFNLFNBQVMsR0FBRyxDQUFDLEdBQVcsRUFBRSxNQUFtRSxFQUEwQixFQUFFO1lBQzdILElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUVaLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxN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