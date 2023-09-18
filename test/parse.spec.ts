import * as chai from 'chai';
const expect = chai.expect;
import NACHParser from '../lib/file/FileParser.js';

describe('Parse', function() {
  this.timeout(5000);

  describe('Validate', function() {
    it('should parse successfully', async() => {
      try {
        const file = await NACHParser.parseFile(__dirname + '/nachFiles/nach-valid.txt', true);
        expect(file).not.equal(null);
        expect(file).not.equal(undefined);
      } catch (error) {
        throw error;
      }
    });

    it('should parse Addenda successfully', async() => {
      try {
        const file = await NACHParser.parseFile(`${__dirname}/nachFiles/nach-valid-addenda.txt`, true);

        expect(file).not.equal(null).and.not.equal(undefined);

        file.getBatches().forEach(batch => {
          batch.getEntries().forEach(entry => {
            entry.getAddendas().forEach(addenda => {
              expect(addenda.getReturnCode()).equal('R14');
            });
          });
        });

        expect(file).not.equal(undefined);
      } catch (error) {
        throw error;
      }
    });

    it('should parse Addenda successfully with promise', (done) => {
      NACHParser.parseFile(__dirname + '/nachFiles/nach-valid-addenda.txt', true)
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
