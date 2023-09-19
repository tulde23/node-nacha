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
const Entry_js_1 = __importDefault(require("../lib/entry/Entry.js"));
const EntryAddenda_js_1 = __importDefault(require("../lib/entry-addenda/EntryAddenda.js"));
const expect = chai.expect;
describe('Entry', function () {
    describe('Create Entry', () => {
        it('should create an entry successfully', async () => {
            const entry = new Entry_js_1.default({
                receivingDFI: '081000210',
                DFIAccount: '12345678901234567',
                amount: '3521',
                transactionCode: '22',
                idNumber: 'RAj##23920rjf31',
                individualName: 'Glen Selle',
                discretionaryData: 'A1'
            });
            console.log('[EntryTest::entry.generateString] \r\n', await entry.generateString());
            expect(entry).to.not.equal(undefined);
            expect(entry).to.be.an.instanceof(Entry_js_1.default);
        });
    });
    describe('Create Entry with addenda', function () {
        it('should create an entry with an addenda successfully', async () => {
            const entry = new Entry_js_1.default({
                receivingDFI: '081000210',
                DFIAccount: '12345678901234567',
                amount: '3521',
                transactionCode: '22',
                idNumber: 'RAj##23920rjf31',
                individualName: 'Glen Selle',
                discretionaryData: 'A1',
                traceNumber: '000000001234567'
            });
            expect(entry.getRecordCount(), '[Entry:getRecordCount()]').to.equal(1);
            entry.addAddenda(new EntryAddenda_js_1.default({ paymentRelatedInformation: "3456789ABCDEFGJIJKLMNOPQRSTUVWXYXabcdefgjijklmnopqrstuvwxyx" }));
            expect(entry.get('addendaId'), '[Entry:get(\'addendaId\')]').to.equal('1');
            expect(entry.getRecordCount(), '[Entry:getRecordCount()]').to.equal(2);
            expect(entry.addendas[0].get('addendaSequenceNumber'), '[Addenda:get(\'addendaSequenceNumber\')]').to.equal(1);
            expect(entry.addendas[0].get('entryDetailSequenceNumber'), '[Entry:get(\'entryDetailSequenceNumber\')]').to.equal('1234567');
            entry.addAddenda(new EntryAddenda_js_1.default({ paymentRelatedInformation: "0123456789ABCDEFGJIJKLMNOPQRSTUVWXYXabcdefgjijklmnopqrstuvwxyx" }));
            expect(entry.get('addendaId'), '[Entry:get(\'addendaId\')]').to.equal('1');
            expect(entry.getRecordCount(), '[Entry:getRecordCount()]').to.equal(3);
            expect(entry.addendas[1].get('addendaSequenceNumber')).to.equal(2);
            expect(entry.addendas[1].get('entryDetailSequenceNumber')).to.equal('1234567');
            console.log('[EntryTest::entry.generateString] \r\n', await entry.generateString());
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnkuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVudHJ5LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3QixxRUFBMEM7QUFDMUMsMkZBQWdFO0FBQ2hFLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFFM0IsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUM1QixFQUFFLENBQUMscUNBQXFDLEVBQUUsS0FBSyxJQUFHLEVBQUU7WUFDbEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxrQkFBSyxDQUFDO2dCQUN0QixZQUFZLEVBQUUsV0FBVztnQkFDekIsVUFBVSxFQUFFLG1CQUFtQjtnQkFDL0IsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsZUFBZSxFQUFFLElBQUk7Z0JBQ3JCLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLGNBQWMsRUFBRSxZQUFZO2dCQUM1QixpQkFBaUIsRUFBRSxJQUFJO2FBQ3hCLENBQUMsQ0FBQztZQUVILE9BQU8sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLEVBQUUsTUFBTSxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztZQUVwRixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxrQkFBSyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQywyQkFBMkIsRUFBRTtRQUNwQyxFQUFFLENBQUMscURBQXFELEVBQUUsS0FBSyxJQUFHLEVBQUU7WUFDbEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxrQkFBSyxDQUFDO2dCQUN0QixZQUFZLEVBQUUsV0FBVztnQkFDekIsVUFBVSxFQUFFLG1CQUFtQjtnQkFDL0IsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsZUFBZSxFQUFFLElBQUk7Z0JBQ3JCLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLGNBQWMsRUFBRSxZQUFZO2dCQUM1QixpQkFBaUIsRUFBRSxJQUFJO2dCQUN2QixXQUFXLEVBQUUsaUJBQWlCO2FBQy9CLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLEVBQUUsMEJBQTBCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXZFLEtBQUssQ0FBQyxVQUFVLENBQ2QsSUFBSSx5QkFBWSxDQUFDLEVBQUUseUJBQXlCLEVBQUUsNkRBQTZELEVBQUUsQ0FBQyxDQUMvRyxDQUFDO1lBRUYsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsNEJBQTRCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLEVBQUUsMEJBQTBCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLDBDQUEwQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMvRyxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsRUFBRSw0Q0FBNEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFN0gsS0FBSyxDQUFDLFVBQVUsQ0FDZCxJQUFJLHlCQUFZLENBQUMsRUFBRSx5QkFBeUIsRUFBRSxnRUFBZ0UsRUFBRSxDQUFDLENBQ2xILENBQUM7WUFFRixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0UsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdkUsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25FLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUUvRSxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUF3QyxFQUFFLE1BQU0sS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDdEYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=