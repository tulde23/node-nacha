"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai = __importStar(require("chai"));
const expect = chai.expect;
const FileParser_js_1 = __importDefault(require("../lib/file/FileParser.js"));
describe('Parse', function () {
    this.timeout(5000);
    describe('Validate', function () {
        it('should parse successfully', async () => {
            try {
                const file = await FileParser_js_1.default.parseFile(__dirname + '/nachFiles/nach-valid.txt');
                expect(file).not.equal(null);
                expect(file).not.equal(undefined);
            }
            catch (error) {
                throw error;
            }
        });
        it('should parse Addenda successfully', async () => {
            try {
                const file = await FileParser_js_1.default.parseFile(`${__dirname}/nachFiles/nach-valid-addenda.txt`);
                expect(file).not.equal(null).and.not.equal(undefined);
                file.getBatches().forEach(batch => {
                    batch.getEntries().forEach(entry => {
                        entry.getAddendas().forEach(addenda => {
                            expect(addenda.getReturnCode()).equal('R14');
                        });
                    });
                });
                expect(file).not.equal(undefined);
            }
            catch (error) {
                throw error;
            }
        });
        it('should parse Addenda successfully with promise', (done) => {
            FileParser_js_1.default.parseFile(__dirname + '/nachFiles/nach-valid-addenda.txt')
                .then((file) => {
                expect(file).not.equal(null);
                expect(file).not.equal(undefined);
                done();
            })
                .catch((error) => {
                done(error);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2Uuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhcnNlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzNCLDhFQUFtRDtBQUVuRCxRQUFRLENBQUMsT0FBTyxFQUFFO0lBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFbkIsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixFQUFFLENBQUMsMkJBQTJCLEVBQUUsS0FBSyxJQUFHLEVBQUU7WUFDeEMsSUFBSTtnQkFDRixNQUFNLElBQUksR0FBRyxNQUFNLHVCQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRywyQkFBMkIsQ0FBQyxDQUFDO2dCQUNqRixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDbkM7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxNQUFNLEtBQUssQ0FBQzthQUNiO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUUsS0FBSyxJQUFHLEVBQUU7WUFDaEQsSUFBSTtnQkFDRixNQUFNLElBQUksR0FBRyxNQUFNLHVCQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxtQ0FBbUMsQ0FBQyxDQUFDO2dCQUV6RixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFdEQsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDaEMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTt3QkFDakMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTs0QkFDcEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQzt3QkFDL0MsQ0FBQyxDQUFDLENBQUM7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDbkM7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxNQUFNLEtBQUssQ0FBQzthQUNiO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsZ0RBQWdELEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1RCx1QkFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsbUNBQW1DLENBQUM7aUJBQ2xFLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxFQUFFLENBQUM7WUFDVCxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==