// Batch
import moment from 'moment';
import { BatchControls, BatchHeaders, BatchOptions, HighLevelControlOverrides, HighLevelHeaderOverrides } from '../Types.js';
import { computeCheckDigit, formatDate, generateString, newLineChar, overrideLowLevel } from './../utils';
import { validateACHServiceClassCode, validateDataTypes, validateLengths, validateRequiredFields, validateRoutingNumber } from './../validate';
import { control } from './control';
import { header } from './header';
import { Entry } from '../entry/index.js';

const highLevelHeaderOverrides: Array<HighLevelHeaderOverrides> = ['serviceClassCode', 'companyDiscretionaryData', 'companyIdentification', 'standardEntryClassCode'];
const highLevelControlOverrides: Array<HighLevelControlOverrides> = ['addendaCount', 'entryHash', 'totalDebit', 'totalCredit'];

export default class Batch {
  _entries: Array<Entry> = [];
  header: BatchHeaders;
  control: BatchControls;

  constructor(options: BatchOptions, autoValidate: boolean) {
    // Allow the batch header/control defaults to be override if provided
    this.header = (options.header) ? { ...options.header, ...header } : { ...header };
    this.control = (options.control)
      ? ({ ...options.control, ...control } as unknown as typeof control)
      : ({ ...control } as unknown as typeof control);

    // Configure high-level overrides (these override the low-level settings if provided)
    overrideLowLevel(highLevelHeaderOverrides, options, this);
    overrideLowLevel(highLevelControlOverrides, options, this);

    if (autoValidate !== false) {
      // Validate the routing number (ABA) before slicing
      validateRoutingNumber(computeCheckDigit(options.originatingDFI));
    }

    if (options.companyName) {
      this.header.companyName.value = options.companyName.slice(0, this.header.companyName.width);
    }

    if (options.companyEntryDescription) {
      this.header.companyEntryDescription.value = options.companyEntryDescription.slice(0, this.header.companyEntryDescription.width);
    }

    if (options.companyDescriptiveDate) {
      this.header.companyDescriptiveDate.value = options.companyDescriptiveDate.slice(0, this.header.companyDescriptiveDate.width);
    }

    if (options.effectiveEntryDate) {
      if (typeof options.effectiveEntryDate == 'string') {
        options.effectiveEntryDate = moment(options.effectiveEntryDate, 'YYMMDD').toDate();
      }
      this.header.effectiveEntryDate.value = formatDate(options.effectiveEntryDate);
    }

    if (options.originatingDFI) {
      this.header.originatingDFI.value = computeCheckDigit(options.originatingDFI).slice(0, this.header.originatingDFI.width);
    }

    // Set control values which use the same header values
    this.control.serviceClassCode.value = this.header.serviceClassCode.value;
    this.control.companyIdentification.value = this.header.companyIdentification.value;
    this.control.originatingDFI.value = this.header.originatingDFI.value;

    if (autoValidate !== false) {
      // Perform validation on all the passed values
      this._validate();
    }
  }

  _validate() {
    // Validate required fields have been passed
    validateRequiredFields(this.header);

    // Validate the batch's ACH service class code
    validateACHServiceClassCode(this.header.serviceClassCode.value);

    // Validate field lengths
    validateLengths(this.header);

    // Validate datatypes
    validateDataTypes(this.header);

    // Validate required fields have been passed
    validateRequiredFields(this.control);

    // Validate field lengths
    validateLengths(this.control);

    // Validate datatypes
    validateDataTypes(this.control);
  }

  async addEntry(entry: Entry) {
    // Increment the addendaCount of the batch
    if (typeof this.control.addendaCount.value === 'number') this.control.addendaCount.value += entry.getRecordCount();

    // Add the new entry to the entries array
    this._entries.push(entry);

    // Update the batch values like total debit and credit $ amounts
    let entryHash = 0;
    let totalDebit = 0;
    let totalCredit = 0;

    // (22, 23, 24, 27, 28, 29, 32, 33, 34, 37, 38 & 39)
    const creditCodes = ['22', '23', '24', '32', '33', '34'];
    const debitCodes = ['27', '28', '29', '37', '38', '39'];

    try {
      for await (const entry of this._entries) {
        entryHash += Number(entry.fields.receivingDFI.value);

        if ((creditCodes).includes(entry.fields.transactionCode.value)) {
          totalCredit += entry.fields.amount.value;
        } else if (debitCodes.includes(entry.fields.transactionCode.value)) {
          totalDebit += entry.fields.amount.value;
        } else {
          console.log('Transaction codes did not match or are not supported yet (unsupported status codes include: 23, 24, 28, 29, 33, 34, 38, 39)');
        }
      }
    } catch (error) {
      this.control.totalCredit.value = totalCredit;
      this.control.totalDebit.value = totalDebit;

      // Add up the positions 4-11 and compute the total. Slice the 10 rightmost digits.
      this.control.entryHash.value = entryHash.toString().slice(-10);

      console.error('Transaction codes did not match or are not supported yet (unsupported status codes include: 23, 24, 28, 29, 33, 34, 38, 39)');
    }
  }

  getEntries() { return this._entries; }

  generateHeader(cb: (arg0: string) => void) {
    return generateString(this.header, function(string) { cb(string); });
  }

  generateControl(cb: (arg0: string) => void) {
    return generateString(this.control, function(string) { cb(string); });
  }

  generateEntries(cb: (arg0: string) => void) {
    let result = '';

    for (const entry of this._entries) {
      entry.generateString((string: string) => { result += string + newLineChar() });
    }

    cb(result);
  }

  generateString(cb: (arg0: string) => void) {
    this.generateHeader((headerString: string) => {
      this.generateEntries((entryString: string) => {
        this.generateControl((controlString: string) => {
          cb(headerString + newLineChar() + entryString + controlString);
        });
      });
    });
  }

  get<Field extends keyof typeof header | keyof typeof control = keyof typeof header | keyof typeof control>(field: Field) {
    // If the header has the field, return the value
    if (field in this.header) {
      return this.header[field as keyof typeof header]['value'];
    }

    // If the control has the field, return the value
    if (field in this.control) {
      return this.control[field as keyof typeof control]['value'];
    }
  }

  set<Field extends keyof typeof header | keyof typeof control = keyof typeof header | keyof typeof control>(field: Field, value: string|number) {
    // If the header has the field, set the value
    if (field in this.header) {
      this.header[field as keyof typeof header]['value'] = value;
    }

    // If the control has the field, set the value
    if (field in this.control) {
      this.control[field as keyof typeof control]['value'] = value;
    }
  }
}

module.exports = Batch;
