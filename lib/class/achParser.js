"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const overrides_js_1 = require("../overrides.js");
const utils_js_1 = require("../utils.js");
class achBuilder {
    constructor({ options, name, debug }) {
        this.debug = false;
        this.typeGuards = {
            isEntryOptions: (arg) => {
                if (typeof arg !== 'object') {
                    if (this.debug)
                        console.debug('isEntryOptions() failed because arg is not an object');
                    return false;
                }
                if (Object.keys(arg).length === 0) {
                    if (this.debug)
                        console.debug('isEntryOptions() failed because arg has no keys');
                    return false;
                }
                if ('amount' in arg)
                    return true;
                if (this.debug)
                    console.debug('isEntryOptions() failed because arg has no amount key', { arg });
                return false;
            },
            isEntryAddendaOptions(arg) {
                if (typeof arg !== 'object')
                    return false;
                if (Object.keys(arg).length === 0)
                    return false;
                if ('paymentRelatedInformation' in arg)
                    return true;
                return false;
            },
            isBatchOptions(arg) {
                if (typeof arg !== 'object')
                    return false;
                if (Object.keys(arg).length === 0)
                    return false;
                if ('originatingDFI' in arg)
                    return true;
                return false;
            },
            isFileOptions(arg) {
                if (typeof arg !== 'object')
                    return false;
                if (Object.keys(arg).length === 0)
                    return false;
                if ('immediateDestination' in arg)
                    return true;
                return false;
            },
            isEntryOverrides(arg) {
                if (!Array.isArray(arg))
                    return false;
                if (arg.length === 0)
                    return false;
                return (0, utils_js_1.compareSets)(new Set(arg), overrides_js_1.highLevelFieldOverrideSet);
            },
            isEntryAddendaOverrides(arg) {
                if (!Array.isArray(arg))
                    return false;
                if (arg.length === 0)
                    return false;
                return (0, utils_js_1.compareSets)(new Set(arg), overrides_js_1.highLevelAddendaFieldOverrideSet);
            },
            isFileOverrides(arg) {
                if (!Array.isArray(arg))
                    return false;
                if (arg.length === 0)
                    return false;
                return (0, utils_js_1.compareSets)(new Set(arg), overrides_js_1.highLevelFileOverrideSet);
            }
        };
        this.name = name;
        this.options = options;
        this.debug = debug || false;
    }
}
exports.default = achBuilder;
module.exports = achBuilder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNoUGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsYXNzL2FjaFBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLGtEQUF3SDtBQUN4SCwwQ0FBMEM7QUF3QjFDLE1BQXFCLFVBQVU7SUFtRTdCLFlBQVksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBMkQ7UUEzRHRGLFVBQUssR0FBRyxLQUFLLENBQUM7UUFFckIsZUFBVSxHQUFHO1lBQ1gsY0FBYyxFQUFFLENBQUMsR0FBOEQsRUFBdUIsRUFBRTtnQkFDdEcsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUM7b0JBQzFCLElBQUksSUFBSSxDQUFDLEtBQUs7d0JBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO29CQUN0RixPQUFPLEtBQUssQ0FBQztpQkFDZDtnQkFDRCxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBQztvQkFDaEMsSUFBSSxJQUFJLENBQUMsS0FBSzt3QkFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7b0JBQ2pGLE9BQU8sS0FBSyxDQUFDO2lCQUNkO2dCQUVELElBQUksUUFBUSxJQUFJLEdBQUc7b0JBQUUsT0FBTyxJQUFJLENBQUM7Z0JBRWpDLElBQUksSUFBSSxDQUFDLEtBQUs7b0JBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyx1REFBdUQsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQ2hHLE9BQU8sS0FBSyxDQUFDO1lBQ2YsQ0FBQztZQUNELHFCQUFxQixDQUFDLEdBQThEO2dCQUNsRixJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVE7b0JBQUUsT0FBTyxLQUFLLENBQUM7Z0JBQzFDLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQztvQkFBRSxPQUFPLEtBQUssQ0FBQztnQkFDaEQsSUFBSSwyQkFBMkIsSUFBSSxHQUFHO29CQUFFLE9BQU8sSUFBSSxDQUFDO2dCQUVwRCxPQUFPLEtBQUssQ0FBQztZQUNmLENBQUM7WUFDRCxjQUFjLENBQUMsR0FBOEQ7Z0JBQzNFLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUTtvQkFBRSxPQUFPLEtBQUssQ0FBQztnQkFDMUMsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDO29CQUFFLE9BQU8sS0FBSyxDQUFDO2dCQUNoRCxJQUFJLGdCQUFnQixJQUFJLEdBQUc7b0JBQUUsT0FBTyxJQUFJLENBQUM7Z0JBRXpDLE9BQU8sS0FBSyxDQUFDO1lBQ2YsQ0FBQztZQUNELGFBQWEsQ0FBQyxHQUE4RDtnQkFDMUUsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRO29CQUFFLE9BQU8sS0FBSyxDQUFDO2dCQUMxQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUM7b0JBQUUsT0FBTyxLQUFLLENBQUM7Z0JBQ2hELElBQUksc0JBQXNCLElBQUksR0FBRztvQkFBRSxPQUFPLElBQUksQ0FBQztnQkFFL0MsT0FBTyxLQUFLLENBQUM7WUFDZixDQUFDO1lBQ0QsZ0JBQWdCLENBQUMsR0FBMEk7Z0JBQ3pKLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztvQkFBRSxPQUFPLEtBQUssQ0FBQztnQkFDdEMsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUM7b0JBQUUsT0FBTyxLQUFLLENBQUM7Z0JBRW5DLE9BQU8sSUFBQSxzQkFBVyxFQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLHdDQUF5QixDQUFDLENBQUM7WUFDOUQsQ0FBQztZQUNELHVCQUF1QixDQUFDLEdBQTBJO2dCQUNoSyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7b0JBQUUsT0FBTyxLQUFLLENBQUM7Z0JBQ3RDLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDO29CQUFFLE9BQU8sS0FBSyxDQUFDO2dCQUVuQyxPQUFPLElBQUEsc0JBQVcsRUFBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSwrQ0FBZ0MsQ0FBQyxDQUFDO1lBQ3JFLENBQUM7WUFDRCxlQUFlLENBQUMsR0FBMEk7Z0JBQ3hKLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztvQkFBRSxPQUFPLEtBQUssQ0FBQztnQkFDdEMsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUM7b0JBQUUsT0FBTyxLQUFLLENBQUM7Z0JBRW5DLE9BQU8sSUFBQSxzQkFBVyxFQUFDLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLHVDQUF3QixDQUFDLENBQUM7WUFDN0QsQ0FBQztTQUNGLENBQUE7UUFHQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssSUFBSSxLQUFLLENBQUM7SUFDOUIsQ0FBQztDQUNGO0FBeEVELDZCQXdFQztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDIn0=