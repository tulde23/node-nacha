// Create a new object, that prototypically inherits from the Error constructor.
export default class nACHError extends Error {
  constructor(errorObj: { message: string; name: string; }) {
    super(errorObj.message || 'Uncaught nACHError');
    this.name = `nACHError[${errorObj.name}]`|| 'nACHError';
    this.message = errorObj.message || 'Uncaught nACHError';
  }
}
