const chai = require('chai');
const expect = chai.expect;
const moment = require('moment');
const { generateString, pad, formatDateToYYMMDD, formatTime, parseYYMMDD } = require('../lib/utils.js');

describe('Utils', function() {
  describe('pad', function() {
    it('should add pad', function() {
      const testStr = "1991", testWidth = 0;

      expect(() => { pad(testStr, testWidth) }).not.to.throw('Padding not adding');
    });
  });

  describe('GenerateString', function() {
    it("Test to see if object can be passed", function() {
      expect(() => {
        generateString({
          testRecord: {
            name: 'Record Type Code',
            width: 1,
            position: 1,
            required: true,
            type: 'numeric',
            value: '5'
          }
        })
      }).not.to.throw('Not passing object correctly.');
    });
  });

  describe('parseYYMMDD', function() {
    it('Should parse \'180101\' correctly into a Date', function() {
      const date = parseYYMMDD('180101');

      expect(date.getFullYear()).to.equal(2018);
      expect(date.getMonth()).to.equal(0);
      expect(date.getDate()).to.equal(1);
    })
  })

  describe('YYMMDD', function() {
    it('Must return the current date', function() {
      const today = new Date();

      const date = moment(today).format('YYMMDD');
      const dateNum = formatDateToYYMMDD(today);

      expect(dateNum).to.equal(date);
    });
  });

  describe('HHMM', function() {
    it('Must return the current time', function() {
      const now = new Date();
      const momentNow = moment(now).format('HHmm');
      const time = formatTime(now);

      expect(time).to.equal(momentNow);
    });
  });
});
