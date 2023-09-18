"use strict";
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
    static async parseFile(filePath, debug = false) {
        try {
            const data = await (0, promises_1.readFile)(filePath, { encoding: 'utf-8' });
            const file = await this.parse(data, debug);
            if (!file)
                throw new Error('File could not be parsed');
            return file;
        }
        catch (err) {
            console.error('[node-natcha::File:parseFile] - Error', err);
            throw err;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZVBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9maWxlL0ZpbGVQYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwQ0FBdUM7QUFDdkMsaUVBQXNDO0FBRXRDLG9EQUErRDtBQUMvRCxrREFBNEQ7QUFDNUQsdUZBQTREO0FBQzVELDBEQUFxRTtBQUNyRSxpRUFBc0M7QUFFdEMsa0RBQTJEO0FBQzNELHdEQUE2QjtBQUU3Qiw2Q0FBNEM7QUFDNUMsMkNBQTBDO0FBRTFDLE1BQXFCLFVBQVU7SUFDN0I7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQWdCLEVBQUUsUUFBaUIsS0FBSztRQUM3RCxJQUFJO1lBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFBLG1CQUFRLEVBQUMsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFDN0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsSUFBSTtnQkFBRSxNQUFNLElBQUksS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7WUFDdkQsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUM1RCxNQUFNLEdBQUcsQ0FBQztTQUNYO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBVyxFQUFFLEtBQWM7UUFDdEMsTUFBTSxTQUFTLEdBQUcsQ0FBQyxHQUFXLEVBQUUsTUFBbUUsRUFBMEIsRUFBRTtZQUM3SCxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFFWixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBOEIsRUFBRSxHQUFXLEVBQUUsRUFBRTtnQkFDaEYsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMxQixNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDM0QsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQ25CLE9BQU8sTUFBTSxDQUFDO1lBQ2hCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQTtRQUVELE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDckMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUU7Z0JBQUUsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUM7Z0JBQUMsT0FBTzthQUFFO1lBRXJFLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFNUIsSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtnQkFDckIsS0FBSyxHQUFHLEVBQUUsQ0FBQztnQkFDWCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO29CQUN2QyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQy9CO2FBQ0Y7WUFFRCxNQUFNLElBQUksR0FBeUIsRUFBRSxDQUFDO1lBQ3RDLE1BQU0sT0FBTyxHQUEyRCxFQUFFLENBQUM7WUFDM0UsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztZQUV2QixLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ3JCLElBQUk7b0JBQ0YsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNO3dCQUFFLE9BQU87b0JBQ2xDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ25CLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFbkMsSUFBSSxRQUFRLEtBQUssQ0FBQzt3QkFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsdUJBQVcsQ0FBMkIsQ0FBQztvQkFDekYsSUFBSSxRQUFRLEtBQUssQ0FBQzt3QkFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUseUJBQVksQ0FBNEIsQ0FBQztvQkFDNUYsSUFBSSxRQUFRLEtBQUssQ0FBQyxFQUFDO3dCQUNqQixPQUFPLENBQUMsSUFBSSxDQUFDOzRCQUNYLE1BQU0sRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLGtCQUFZLENBQTRCOzRCQUNoRSxLQUFLLEVBQUUsRUFBRTt5QkFDVixDQUFDLENBQUM7cUJBQ0o7b0JBQ0QsSUFBSSxRQUFRLEtBQUssQ0FBQyxFQUFFO3dCQUNsQixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsb0JBQWEsQ0FBNkIsQ0FBQzt3QkFDekYsVUFBVSxFQUFFLENBQUM7cUJBQ2Q7b0JBQ0QsSUFBSSxRQUFRLEtBQUssQ0FBQyxFQUFDO3dCQUNqQixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FDNUIsSUFBSSxrQkFBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsa0JBQVcsQ0FBNEIsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQ3JGLENBQUM7cUJBQ0g7b0JBQ0QsSUFBSSxRQUFRLEtBQUssQ0FBQyxFQUFFO3dCQUNsQixPQUFPLENBQUMsVUFBVSxDQUFDOzZCQUNoQixLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzZCQUMzQyxVQUFVLENBQ1QsSUFBSSx5QkFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsa0JBQWEsQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FDbkUsQ0FBQzt3QkFDSixVQUFVLEdBQUcsSUFBSSxDQUFDO3FCQUNuQjtpQkFDRjtnQkFBQyxPQUFPLEtBQUssRUFBRTtvQkFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLG1DQUFtQyxFQUFFLEtBQUssQ0FBQyxDQUFBO29CQUN6RCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7aUJBQ2Y7WUFFSCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUFFLE1BQU0sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO2dCQUFDLE9BQU87YUFBRTtZQUNsRixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBQztnQkFBRSxNQUFNLENBQUMsNENBQTRDLENBQUMsQ0FBQztnQkFBQyxPQUFPO2FBQUU7WUFDbkYsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUU7Z0JBQUUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQUMsT0FBTzthQUFFO1lBRTVELElBQUk7Z0JBQ0YsTUFBTSxRQUFRLEdBQUcsSUFBSSxpQkFBSSxDQUFDLElBQUksQ0FBQyxNQUFnQyxFQUFFLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUVyRixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7b0JBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksa0JBQUssQ0FBQyxPQUFPLENBQUMsTUFBaUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQ3JGLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7d0JBQzlCLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3hCLENBQUMsQ0FBQyxDQUFDO29CQUNILFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzNCLENBQUMsQ0FBQyxDQUFDO2dCQUVILE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUNuQjtZQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUNWLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNYO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUExR0QsNkJBMEdDO0FBQ0QsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMifQ==