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
      });

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
      });

      expect(entry.getRecordCount(), '[Entry:getRecordCount()]').to.equal(1);

      entry.addAddenda(
        new EntryAddenda({ paymentRelatedInformation: "3456789ABCDEFGJIJKLMNOPQRSTUVWXYXabcdefgjijklmnopqrstuvwxyx" })
      );

      expect(entry.get('addendaId'), '[Entry:get(\'addendaId\')]').to.equal('1');
      expect(entry.getRecordCount(), '[Entry:getRecordCount()]').to.equal(2);
      expect(entry.addendas[0].get('addendaSequenceNumber'), '[Addenda:get(\'addendaSequenceNumber\')]').to.equal(1);
      expect(entry.addendas[0].get('entryDetailSequenceNumber'), '[Entry:get(\'entryDetailSequenceNumber\')]').to.equal('1234567');

      entry.addAddenda(
        new EntryAddenda({ paymentRelatedInformation: "0123456789ABCDEFGJIJKLMNOPQRSTUVWXYXabcdefgjijklmnopqrstuvwxyx" })
      );

      expect(entry.get('addendaId'), '[Entry:get(\'addendaId\')]').to.equal('1');
      expect(entry.getRecordCount(), '[Entry:getRecordCount()]').to.equal(3);

      expect(entry.addendas[1].get('addendaSequenceNumber')).to.equal(2);
      expect(entry.addendas[1].get('entryDetailSequenceNumber')).to.equal('1234567');

      console.log('[EntryTest::entry.generateString] \r\n', await entry.generateString());
    });
  });
});
