const chai = require('chai');
const expect = chai.expect;
const File = require('../lib/file/File.js');

describe('Parse', function() {
  describe('Validate', function() {
    it('should parse successfully', async(done) => {
      try {
        const file = await File.parseFile(__dirname + '/nach-valid.txt');
        if (err) throw err;
        expect(file).not.equal(null);
        expect(file).not.equal(undefined);
        done()
      } catch (error) { throw error; }
    });

    it('should parse Addenda successfully', async(done) => {
      try {
       const file = await File.parseFile(__dirname + '/nach-valid-addenda.txt');

        expect(file).not.equal(null).and.not.equal(undefined);
        file.getBatches().forEach(batch => {
          batch.getEntries().forEach(entry => {
            entry.getAddendas().forEach(addenda => {
              expect(addenda.getReturnCode()).equal('R14')
            })
          })
        })
        expect(file).not.equal(undefined);
        done();
      } catch (error) { throw error; }
    });

    it('should parse Addenda successfully with promise', async(done) => {
      try {
        const file = await File.parseFile(__dirname + '/nach-valid-addenda.txt');

        expect(file).not.equal(null);
        expect(file).not.equal(undefined);
        done()
      } catch (error) { throw error; }
    });
  });
});
