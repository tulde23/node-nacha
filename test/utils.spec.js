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
const moment_1 = __importDefault(require("moment"));
const utils_js_1 = require("../lib/utils.js");
describe('Utils', function () {
    describe('pad', function () {
        it('should add pad', function () {
            const testStr = "1991", testWidth = 0;
            expect(() => { (0, utils_js_1.pad)(testStr, testWidth); }).not.to.throw('Padding not adding');
        });
    });
    describe('GenerateString', function () {
        it("Test to see if object can be passed", function () {
            expect(() => {
                (0, utils_js_1.generateString)({
                    recordTypeCode: {
                        name: 'Record Type Code',
                        width: 1,
                        position: 1,
                        required: true,
                        type: 'numeric',
                        value: '5'
                    }
                });
            }).not.to.throw('Not passing object correctly.');
        });
    });
    describe('parseYYMMDD', function () {
        it('Should parse \'180101\' correctly into a Date', function () {
            const date = (0, utils_js_1.parseYYMMDD)('180101');
            expect(date.getFullYear()).to.equal(2018);
            expect(date.getMonth()).to.equal(0);
            expect(date.getDate()).to.equal(1);
        });
    });
    describe('YYMMDD', function () {
        it('Must return the current date', function () {
            const today = new Date();
            const date = (0, moment_1.default)(today).format('YYMMDD');
            const dateNum = (0, utils_js_1.formatDateToYYMMDD)(today);
            expect(dateNum).to.equal(date);
        });
    });
    describe('HHMM', function () {
        it('Must return the current time', function () {
            const now = new Date();
            const momentNow = (0, moment_1.default)(now).format('HHmm');
            const time = (0, utils_js_1.formatTime)(now);
            expect(time).to.equal(momentNow);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInV0aWxzLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUE2QjtBQUM3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzNCLG9EQUE0QjtBQUM1Qiw4Q0FBbUc7QUFFbkcsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixRQUFRLENBQUMsS0FBSyxFQUFFO1FBQ2QsRUFBRSxDQUFDLGdCQUFnQixFQUFFO1lBQ25CLE1BQU0sT0FBTyxHQUFHLE1BQU0sRUFBRSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1lBRXRDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFBLGNBQUcsRUFBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBQy9FLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1lBQ3hDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ1YsSUFBQSx5QkFBYyxFQUFDO29CQUNiLGNBQWMsRUFBRTt3QkFDZCxJQUFJLEVBQUUsa0JBQWtCO3dCQUN4QixLQUFLLEVBQUUsQ0FBQzt3QkFDUixRQUFRLEVBQUUsQ0FBQzt3QkFDWCxRQUFRLEVBQUUsSUFBSTt3QkFDZCxJQUFJLEVBQUUsU0FBUzt3QkFDZixLQUFLLEVBQUUsR0FBRztxQkFDWDtpQkFDRixDQUFDLENBQUE7WUFDSixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsYUFBYSxFQUFFO1FBQ3RCLEVBQUUsQ0FBQywrQ0FBK0MsRUFBRTtZQUNsRCxNQUFNLElBQUksR0FBRyxJQUFBLHNCQUFXLEVBQUMsUUFBUSxDQUFDLENBQUM7WUFFbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxRQUFRLEVBQUU7UUFDakIsRUFBRSxDQUFDLDhCQUE4QixFQUFFO1lBQ2pDLE1BQU0sS0FBSyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFFekIsTUFBTSxJQUFJLEdBQUcsSUFBQSxnQkFBTSxFQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM1QyxNQUFNLE9BQU8sR0FBRyxJQUFBLDZCQUFrQixFQUFDLEtBQUssQ0FBQyxDQUFDO1lBRTFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsTUFBTSxFQUFFO1FBQ2YsRUFBRSxDQUFDLDhCQUE4QixFQUFFO1lBQ2pDLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7WUFDdkIsTUFBTSxTQUFTLEdBQUcsSUFBQSxnQkFBTSxFQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUM3QyxNQUFNLElBQUksR0FBRyxJQUFBLHFCQUFVLEVBQUMsR0FBRyxDQUFDLENBQUM7WUFFN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=