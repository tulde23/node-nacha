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
                const file = await FileParser_js_1.default.parseFile(__dirname + '/nachFiles/nach-valid.txt', true);
                expect(file).not.equal(null);
                expect(file).not.equal(undefined);
            }
            catch (error) {
                throw error;
            }
        });
        it('should parse Addenda successfully', async () => {
            try {
                const file = await FileParser_js_1.default.parseFile(`${__dirname}/nachFiles/nach-valid-addenda.txt`, true);
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
            FileParser_js_1.default.parseFile(__dirname + '/nachFiles/nach-valid-addenda.txt', true)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2Uuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhcnNlLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzNCLDhFQUFtRDtBQUVuRCxRQUFRLENBQUMsT0FBTyxFQUFFO0lBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFbkIsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixFQUFFLENBQUMsMkJBQTJCLEVBQUUsS0FBSyxJQUFHLEVBQUU7WUFDeEMsSUFBSTtnQkFDRixNQUFNLElBQUksR0FBRyxNQUFNLHVCQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRywyQkFBMkIsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDdkYsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2FBQ25DO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsTUFBTSxLQUFLLENBQUM7YUFDYjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFLEtBQUssSUFBRyxFQUFFO1lBQ2hELElBQUk7Z0JBQ0YsTUFBTSxJQUFJLEdBQUcsTUFBTSx1QkFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFNBQVMsbUNBQW1DLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRS9GLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUV0RCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNoQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO3dCQUNqQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFOzRCQUNwQyxNQUFNLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUMvQyxDQUFDLENBQUMsQ0FBQztvQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztnQkFFSCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQzthQUNuQztZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLE1BQU0sS0FBSyxDQUFDO2FBQ2I7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnREFBZ0QsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO1lBQzVELHVCQUFVLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxtQ0FBbUMsRUFBRSxJQUFJLENBQUM7aUJBQ3hFLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxFQUFFLENBQUM7WUFDVCxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==