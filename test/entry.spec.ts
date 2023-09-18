import * as chai from 'chai';
import Entry from '../lib/entry/Entry.js';
import EntryAddenda from '../lib/entry-addenda/EntryAddenda.js';
const expect = chai.expect;

describe('Entry', function() {
  describe('Create Entry', () => {
    it('should create an entry successfully', async() => {
      const entry = new Entry({
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
      expect(entry).to.be.an.instanceof(Entry);
    });
  });

  describe('Create Entry with addenda', function() {
    it('should create an entry with an addenda successfully', async() => {
      const entry = new Entry({
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

      const addenda = new EntryAddenda({ paymentRelatedInformation: "3456789ABCDEFGJIJKLMNOPQRSTUVWXYXabcdefgjijklmnopqrstuvwxyx" })

      console.debug('[Entry Test::Addenda 1]', addenda.fields['paymentRelatedInformation'])
      
      entry.addAddenda(addenda);

      expect(entry.get('addendaId'), '[Entry:get(\'addendaId\')]').to.equal('1');
      expect(entry.getRecordCount(), '[Entry:getRecordCount()]').to.equal(2);
      expect(addenda.get('addendaSequenceNumber'), '[Addenda:get(\'addendaSequenceNumber\')]').to.equal(1);
      expect(addenda.get('entryDetailSequenceNumber'), '[Entry:get(\'entryDetailSequenceNumber\')]').to.equal('1234567');

      const addenda2 = new EntryAddenda({ paymentRelatedInformation: "0123456789ABCDEFGJIJKLMNOPQRSTUVWXYXabcdefgjijklmnopqrstuvwxyx" })

      console.debug('[Entry Test::Addenda 2]', addenda2.fields['paymentRelatedInformation'])

      entry.addAddenda(addenda2);

      expect(entry.get('addendaId'), '[Entry:get(\'addendaId\')]').to.equal('1');
      expect(entry.getRecordCount(), '[Entry:getRecordCount()]').to.equal(3);

      expect(addenda2.get('addendaSequenceNumber')).to.equal(2);
      expect(addenda2.get('entryDetailSequenceNumber')).to.equal('1234567');

      console.log('[EntryTest::entry.generateString] \r\n', await entry.generateString());
    });
  });
});
