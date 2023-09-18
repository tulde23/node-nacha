"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
const overrides_js_1 = require("../overrides.js");
const utils_js_1 = require("../utils.js");
const validate_js_1 = __importDefault(require("../validate.js"));
const control_js_1 = require("./control.js");
const header_js_1 = require("./header.js");
class File {
    /**
     *
     * @param {FileOptions} options
     * @param {boolean} autoValidate
     * @param {boolean} debug
     */
    constructor(options, autoValidate = true, debug = false) {
        this.batches = [];
        this.batchSequenceNumber = 0;
        this.debug = debug;
        this.options = options;
        this.overrides = overrides_js_1.highLevelFileOverrides;
        this.header = options.header
            ? { ...header_js_1.FileHeaderDefaults, ...options.header }
            : { ...header_js_1.FileHeaderDefaults };
        this.control = options.control
            ? { ...control_js_1.FileControlDefaults, ...options.control }
            : { ...control_js_1.FileControlDefaults };
        this.overrides.forEach((field) => {
            if (field in this.options && this.options[field] !== undefined) {
                const value = this.options[field];
                if (value !== undefined)
                    this.set(field, value);
            }
        });
        // This is done to make sure we have a 9-digit routing number
        if (options.immediateDestination) {
            this.header.immediateDestination.value = (0, utils_js_1.computeCheckDigit)(options.immediateDestination);
        }
        this.batchSequenceNumber = Number(options.batchSequenceNumber) || 0;
        if (autoValidate)
            this.validate();
    }
    validate() {
        const { validateDataTypes, validateLengths } = (0, validate_js_1.default)(this);
        // Validate header field lengths
        validateLengths(this.header);
        // Validate header data types
        validateDataTypes(this.header);
        // Validate control field lengths
        validateLengths(this.control);
        // Validate header data types
        validateDataTypes(this.control);
    }
    addBatch(batch) {
        // Set the batch number on the header and control records
        batch.header.batchNumber.value = this.batchSequenceNumber;
        batch.control.batchNumber.value = this.batchSequenceNumber;
        // Increment the batchSequenceNumber
        this.batchSequenceNumber++;
        // Add the batch to the file
        this.batches.push(batch);
    }
    getBatches() { return this.batches; }
    generatePaddedRows(rows) {
        let paddedRows = '';
        for (let i = 0; i < rows; i++) {
            paddedRows += '\r\n' + (0, utils_js_1.pad)('', 94, false, '9');
        }
        return paddedRows;
    }
    generateHeader() { return (0, utils_js_1.generateString)(this.header); }
    generateControl() { return (0, utils_js_1.generateString)(this.control); }
    async generateBatches() {
        let result = '';
        let rows = 2;
        let entryHash = 0;
        let addendaCount = 0;
        let totalDebit = 0;
        let totalCredit = 0;
        for await (const batch of this.batches) {
            totalDebit += batch.control.totalDebit.value;
            totalCredit += batch.control.totalCredit.value;
            for (const entry of batch._entries) {
                entry.fields.traceNumber.value = entry.fields.traceNumber.value
                    ?? (this.header.immediateOrigin.value.slice(0, 8) + (0, utils_js_1.pad)(addendaCount, 7, false, '0'));
                entryHash += Number(entry.fields.receivingDFI.value);
                // Increment the addenda and block count
                addendaCount++;
                rows++;
            }
            // Only iterate and generate the batch if there is at least one entry in the batch
            if (batch._entries.length > 0) {
                // Increment the addendaCount of the batch
                this.control.batchCount.value++;
                // Bump the number of rows only for batches with at least one entry
                rows = rows + 2;
                // Generate the batch after we've added the trace numbers
                const batchString = await batch.generateString();
                result += batchString + '\r\n';
            }
        }
        this.control.totalDebit.value = totalDebit;
        this.control.totalCredit.value = totalCredit;
        this.control.addendaCount.value = addendaCount;
        this.control.blockCount.value = (0, utils_js_1.getNextMultiple)(rows, 10) / 10;
        // Slice the 10 rightmost digits.
        this.control.entryHash.value = Number(entryHash.toString().slice(-10));
        return { result, rows };
    }
    async generateFile() {
        const { result: batchString, rows } = await this.generateBatches();
        // Generate the file header
        const header = await this.generateHeader();
        // Generate the file control
        const control = await this.generateControl();
        // Generate the padded rows
        const paddedRows = this.generatePaddedRows((0, utils_js_1.getNextMultipleDiff)(rows, 10));
        // Resolve the promise with the full file string
        return `${header}\r\n${batchString}${control}${paddedRows}`;
    }
    async writeFile(path) {
        try {
            const fileString = await this.generateFile();
            return await (0, promises_1.writeFile)(path, fileString);
        }
        catch (error) {
            console.error('[node-natcha::File:writeFile] - Error', error);
            throw error;
        }
    }
    isAHeaderField(field) {
        return Object.keys(this.header).includes(field);
    }
    isAControlField(field) {
        return Object.keys(this.control).includes(field);
    }
    get(field) {
        // If the header has the field, return the value
        if (field in this.header && this.isAHeaderField(field)) {
            return this.header[field]['value'];
        }
        // If the control has the field, return the value
        if (field in this.control && this.isAControlField(field))
            return this.control[field]['value'];
        throw new Error(`Field ${field} not found in Batch header or control.`);
    }
    set(field, value) {
        // If the header has the field, set the value
        if (field in this.header && this.isAHeaderField(field)) {
            return this.header[field].value = value;
        }
        // If the control has the field, set the value
        if (field in this.control && this.isAControlField(field)) {
            return this.control[field]['value'] = value;
        }
    }
}
exports.default = File;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9maWxlL0ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwwQ0FBd0M7QUFFeEMsa0RBQXlEO0FBQ3pELDBDQUEyRztBQUMzRyxpRUFBeUM7QUFFekMsNkNBQW1EO0FBQ25ELDJDQUFpRDtBQUVqRCxNQUFxQixJQUFJO0lBV3ZCOzs7OztPQUtHO0lBQ0gsWUFBWSxPQUFvQixFQUFFLGVBQXdCLElBQUksRUFBRSxRQUFpQixLQUFLO1FBWDlFLFlBQU8sR0FBaUIsRUFBRSxDQUFDO1FBQzNCLHdCQUFtQixHQUFHLENBQUMsQ0FBQztRQVc5QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUV2QixJQUFJLENBQUMsU0FBUyxHQUFHLHFDQUFzQixDQUFDO1FBRXhDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU07WUFDMUIsQ0FBQyxDQUFDLEVBQUUsR0FBRyw4QkFBa0IsRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUU7WUFDOUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyw4QkFBa0IsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU87WUFDNUIsQ0FBQyxDQUFDLEVBQUUsR0FBRyxnQ0FBbUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUU7WUFDaEQsQ0FBQyxDQUFDLEVBQUUsR0FBRyxnQ0FBbUIsRUFBRSxDQUFDO1FBRS9CLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDL0IsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLFNBQVMsRUFBQztnQkFDN0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFD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