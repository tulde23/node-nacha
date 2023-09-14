import { NumericalString } from '../Types.js';
import achBuilder from '../class/achParser.js';
import Entry from '../entry/Entry.js';
import nACHError from '../error.js';
import { computeCheckDigit, formatDateToYYMMDD, generateString, parseYYMMDD } from '../utils.js';
import validations from '../validate.js';
import { BatchControlFieldWithOptionalValue, BatchControls, BatchHeaders, BatchOptions } from './batchTypes.js';

export default class Batch extends achBuilder<'Batch'> {
  header!: BatchHeaders;
  control!: BatchControls;
  _entries: Array<Entry> = [];

  constructor(options: BatchOptions, autoValidate = true, debug = false) {
    super({ options, name: 'Batch', debug });

    const { typeGuards, overrides } = this;

    if (('header' in overrides && 'control' in overrides)
        && ('header' in this && 'control' in this)
        && typeGuards.isBatchOptions(this.options)
      ){
        overrides.header.forEach((field) => {
          if (this.options[field]) this.set(field, this.options[field] as NonNullable<typeof this.options[typeof field]>);
        });

        overrides.control.forEach((field) => {
          if (this.options[field]) this.set(field, this.options[field] as NonNullable<typeof this.options[typeof field]>);
        });
      } else {
        if (this.debug){
          console.debug('[overrideOptions::Failed Because]', {
            headerInOverrides: 'header' in overrides,
            controlInOverrides: 'control' in overrides,
            headerInThis: 'header' in this,
            controlInThis: 'control' in this,
            isBatchOptions: typeGuards.isBatchOptions(this.options),
          })
        }
      }

    if (autoValidate) {
      // Validate the routing number (ABA) before slicing
      validations(this).validateRoutingNumber(computeCheckDigit(options.originatingDFI));
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
        options.effectiveEntryDate = parseYYMMDD(options.effectiveEntryDate);
      }

      this.header.effectiveEntryDate.value = formatDateToYYMMDD(options.effectiveEntryDate);
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
    const { validateDataTypes, validateLengths, validateRequiredFields, validateACHServiceClassCode } = validations(this);
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

  addEntry(entry: Entry) {
    // Increment the addendaCount of the batch
    if (typeof this.control.addendaCount.value === 'number') this.control.addendaCount.value += entry.getRecordCount();

    // Add the new entry to the entries array
    this._entries.push(entry);

    // Update the batch values like total debit and credit $ amounts
    let entryHash = 0;
    let totalDebit = 0;
    let totalCredit = 0;

    // (22, 23, 24, 27, 28, 29, 32, 33, 34, 37, 38 & 39)
    const creditCodes: Array<NumericalString> = ['22', '23', '24', '32', '33', '34'];
    const debitCodes: Array<NumericalString> = ['27', '28', '29', '37', '38', '39'];

    this._entries.forEach((entry) => {
      entryHash += Number(entry.fields.receivingDFI.value);

      if (typeof entry.fields.amount.value === 'number') {
        if (creditCodes.includes(entry.fields.transactionCode.value as NumericalString)) {
          totalCredit += entry.fields.amount.value;
        } else if (debitCodes.includes(entry.fields.transactionCode.value as NumericalString)) {
          totalDebit += entry.fields.amount.value;
        } else {
          throw new nACHError({
            name: 'Transaction Code Error',
            message: `Transaction code ${entry.fields.transactionCode.value} did not match or are not supported yet (unsupported status codes include: 23, 24, 28, 29, 33, 34, 38, 39)`
          })
        }
      }
    });

    this.control.totalCredit.value = totalCredit;
    this.control.totalDebit.value = totalDebit;

    // Add up the positions 4-11 and compute the total. Slice the 10 rightmost digits.
    this.control.entryHash.value = Number(entryHash.toString().slice(-10));
  }

  getEntries() { return this._entries; }

  generateHeader() { return generateString(this.header); }
  generateControl() { return generateString(this.control); }
  generateEntries() {
    return this._entries.map(entry => entry.generateString()).join('\r\n');
  }
  generateString(): string {
    const headerString = this.generateHeader();
    const entriesString = this.generateEntries();
    const controlString = this.generateControl();
  
    return headerString + '\r\n' + entriesString + controlString;
  }

  isAHeaderField(field: keyof BatchHeaders|keyof BatchControls): field is keyof BatchHeaders {
    return Object.keys(this.header).includes(field)
  }

 isAControlField(field: keyof BatchHeaders|keyof BatchControls): field is keyof BatchControls {
    return Object.keys(this.control).includes(field)
  }

  get<Field extends keyof BatchHeaders|keyof BatchControls = keyof BatchHeaders>(field: Field): Field extends keyof BatchHeaders 
    ? typeof this.header[Field]['value']
    : Field extends Exclude<keyof BatchControls, BatchControlFieldWithOptionalValue>
      ? typeof this.control[Field]['value']
      : Field extends BatchControlFieldWithOptionalValue
        ? string | number | undefined
        : never {
    // If the header has the field, return the value
    if (field in this.header && this.isAHeaderField(field)){
      return this.header[field]['value'] as Field extends keyof BatchHeaders ? typeof this.header[Field]['value'] : never;
    }

    // If the control has the field, return the value
    if (field in this.control && this.isAControlField(field)) return this.control[field]['value'];

    throw new Error(`Field ${field} not found in Batch header or control.`);
  }

  set<Key extends keyof BatchHeaders|keyof BatchControls = keyof BatchHeaders|keyof BatchControls>(
    field: Key,
    value: typeof field extends keyof BatchHeaders
      ? typeof this.header[Key]['value']
      : typeof field extends keyof BatchControls
        ? typeof this.control[Key]['value']
        : never
  ) {
    // If the header has the field, set the value
    if (field in this.header && this.isAHeaderField(field)) {
      if (field === 'serviceClassCode'){
        this.header.serviceClassCode.value = value as `${number}`
      } else {
        this.header[field satisfies keyof BatchHeaders]['value'] = value;
      }
    }

    // If the control has the field, set the value
    if (field in this.control && this.isAControlField(field)) {
      this.control[field satisfies keyof BatchControls]['value'] = value;
    }
  }
}
module.exports = Batch;
