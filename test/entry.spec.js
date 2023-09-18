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
            }, true, true);
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
            }, true, true);
            expect(entry.getRecordCount(), '[Entry:getRecordCount()]').to.equal(1);
            const addenda = new EntryAddenda_js_1.default({ paymentRelatedInformation: "3456789ABCDEFGJIJKLMNOPQRSTUVWXYXabcdefgjijklmnopqrstuvwxyx" });
            console.debug('[Entry Test::Addenda 1]', addenda.fields['paymentRelatedInformation']);
            entry.addAddenda(addenda);
            expect(entry.get('addendaId'), '[Entry:get(\'addendaId\')]').to.equal('1');
            expect(entry.getRecordCount(), '[Entry:getRecordCount()]').to.equal(2);
            expect(addenda.get('addendaSequenceNumber'), '[Addenda:get(\'addendaSequenceNumber\')]').to.equal(1);
            expect(addenda.get('entryDetailSequenceNumber'), '[Entry:get(\'entryDetailSequenceNumber\')]').to.equal('1234567');
            const addenda2 = new EntryAddenda_js_1.default({ paymentRelatedInformation: "0123456789ABCDEFGJIJKLMNOPQRSTUVWXYXabcdefgjijklmnopqrstuvwxyx" });
            console.debug('[Entry Test::Addenda 2]', addenda2.fields['paymentRelatedInformation']);
            entry.addAddenda(addenda2);
            expect(entry.get('addendaId'), '[Entry:get(\'addendaId\')]').to.equal('1');
            expect(entry.getRecordCount(), '[Entry:getRecordCount()]').to.equal(3);
            expect(addenda2.get('addendaSequenceNumber')).to.equal(2);
            expect(addenda2.get('entryDetailSequenceNumber')).to.equal('1234567');
            console.log('[EntryTest::entry.generateString] \r\n', await entry.generateString());
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnkuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVudHJ5LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3QixxRUFBMEM7QUFDMUMsMkZBQWdFO0FBQ2hFLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFFM0IsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixRQUFRLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUM1QixFQUFFLENBQUMscUNBQXFDLEVBQUUsS0FBSyxJQUFHLEVBQUU7WUFDbEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxrQkFBSyxDQUFDO2dCQUN0QixZQUFZLEVBQUUsV0FBVztnQkFDekIsVUFBVSxFQUFFLG1CQUFtQjtnQkFDL0IsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsZUFBZSxFQUFFLElBQUk7Z0JBQ3JCLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLGNBQWMsRUFBRSxZQUFZO2dCQUM1QixpQkFBaUIsRUFBRSxJQUFJO2FBQ3hCLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBRWYsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsRUFBRSxNQUFNLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1lBRXBGLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUN0QyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGtCQUFLLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLDJCQUEyQixFQUFFO1FBQ3BDLEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxLQUFLLElBQUcsRUFBRTtZQUNsRSxN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