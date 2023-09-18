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
    // describe('Create Entry', () => {
    //   it('should create an entry successfully', async() => {
    //     const entry = new Entry({
    //       receivingDFI: '081000210',
    //       DFIAccount: '12345678901234567',
    //       amount: '3521',
    //       transactionCode: '22',
    //       idNumber: 'RAj##23920rjf31',
    //       individualName: 'Glen Selle',
    //       discretionaryData: 'A1'
    //     }, true, true);
    //     console.log('[EntryTest::entry.generateString] \r\n', await entry.generateString());
    //     expect(entry).to.not.equal(undefined);
    //     expect(entry).to.be.an.instanceof(Entry);
    //   });
    // });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnkuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVudHJ5LnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3QixxRUFBMEM7QUFDMUMsMkZBQWdFO0FBQ2hFLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFFM0IsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixtQ0FBbUM7SUFDbkMsMkRBQTJEO0lBQzNELGdDQUFnQztJQUNoQyxtQ0FBbUM7SUFDbkMseUNBQXlDO0lBQ3pDLHdCQUF3QjtJQUN4QiwrQkFBK0I7SUFDL0IscUNBQXFDO0lBQ3JDLHNDQUFzQztJQUN0QyxnQ0FBZ0M7SUFDaEMsc0JBQXNCO0lBRXRCLDJGQUEyRjtJQUUzRiw2Q0FBNkM7SUFDN0MsZ0RBQWdEO0lBQ2hELFFBQVE7SUFDUixNQUFNO0lBRU4sUUFBUSxDQUFDLDJCQUEyQixFQUFFO1FBQ3BDLEVBQUUsQ0FBQyxxREFBcUQsRUFBRSxLQUFLLElBQUcsRUFBRTtZQUNsRSxNQUFNLEtBQUssR0FBRyxJQUFJLGtCQUFLLENBQUM7Z0JBQ3RCLFlBQVksRUFBRSxXQUFXO2dCQUN6QixVQUFVLEVBQUUsbUJBQW1CO2dCQUMvQixNQUFNLEVBQUUsTUFBTTtnQkFDZCxlQUFlLEVBQUUsSUFBSTtnQkFDckIsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsY0FBYyxFQUFFLFlBQVk7Z0JBQzVCLGlCQUFpQixFQUFFLElBQUk7Z0JBQ3ZCLFdBQVcsRUFBRSxpQkFBaUI7YUFDL0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFZixNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxFQUFFLDBCQUEwQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV2RSxLQUFLLENBQUMsVUFBVSxDQUNkLElBQUkseUJBQVksQ0FBQyxFQUFFLHlCQUF5QixFQUFFLDZEQUE2RCxFQUFFLENBQUMsQ0FDL0csQ0FBQztZQUVGLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxFQUFFLDRCQUE0QixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzRSxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxFQUFFLDBCQUEwQixDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsRUFBRSwwQ0FBMEMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0csTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLDJCQUEyQixDQUFDLEVBQUUsNENBQTRDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBRTdILEtBQUssQ0FBQyxVQUFVLENBQ2QsSUFBSSx5QkFBWSxDQUFDLEVBQUUseUJBQXlCLEVBQUUsZ0VBQWdFLEVBQUUsQ0FBQyxDQUNsSCxDQUFDO1lBRUYsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsNEJBQTRCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLEVBQUUsMEJBQTBCLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXZFLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFL0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsRUFBRSxNQUFNLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ3RGLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9