const chai = require('chai');
const expect = chai.expect;
const Entry = require('../lib/class/Entry.js');
const EntryAddenda = require('../lib/class/EntryAddenda.js');

describe('Entry', function() {
  describe('Create Entry', function() {
    it('should create an entry successfully', function() {
      const entry = new Entry({
        receivingDFI: '081000210',
        DFIAccount: '12345678901234567',
        amount: '3521',
        transactionCode: '22',
        idNumber: 'RAj##23920rjf31',
        individualName: 'Glen Selle',
        discretionaryData: 'A1'
      }, true, true);
      
      console.log(entry.generateString())
    });
  });

  describe('Create Entry with addenda', function() {
    it('should create an entry with an addenda successfully', function() {
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

      const addenda = new EntryAddenda({ paymentRelatedInformation: "3456789ABCDEFGJIJKLMNOPQRSTUVWXYXabcdefgjijklmnopqrstuvwxyx" })

      entry.addAddenda(addenda);

      expect(entry.get('addendaId', '[Entry:get(\'addendaId\')]')).to.equal('1');
      expect(entry.getRecordCount(), '[Entry:getRecordCount()]').to.equal(2);
      expect(addenda.get('addendaSequenceNumber'), '[Addenda:get(\'addendaSequenceNumber\')]').to.equal(1);
      expect(addenda.get('entryDetailSequenceNumber', '[Entry:get(\'entryDetailSequenceNumber\')]' )).to.equal('1234567');

      const addenda2 = new EntryAddenda({ paymentRelatedInformation: "0123456789ABCDEFGJIJKLMNOPQRSTUVWXYXabcdefgjijklmnopqrstuvwxyx" })

      entry.addAddenda(addenda2);

      expect(entry.get('addendaId', '[Entry:get(\'addendaId\')]')).to.equal('1');
      expect(entry.getRecordCount(), '[Entry:getRecordCount()]').to.equal(3);

      expect(addenda2.get('addendaSequenceNumber')).to.equal(2);
      expect(addenda2.get('entryDetailSequenceNumber')).to.equal('1234567');

      console.log(entry.generateString());
    });
  });
});
