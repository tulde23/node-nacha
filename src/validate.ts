export function getNextMultipleDiff(value: number, multiple: number) {
  return (value + (multiple - value % multiple)) - value;
}

// Insure a given transaction code is valid
// export function validateACHAddendaCode(transactionCode: NumericalString) {
  // if (transactionCode.length !== 2 || !_.includes(ACHTransactionCodes, transactionCode)) {
  //   throw new nACHError({
  //     name: 'ACH Transaction Code Error',
  //     message: 'The ACH transaction code ' + transactionCode + ' is invalid for addenda records. Please pass a valid 2-digit transaction code.'
  //   });
  // }

//   return true;
// } //? WTF is this function for?


module.exports = { getNextMultipleDiff }
