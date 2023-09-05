"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Create a new object, that prototypically inherits from the Error constructor.
class nACHError extends Error {
    constructor(errorObj) {
        super(errorObj.message || 'Uncaught nACHError');
        this.name = `nACHError[${errorObj.name}]` || 'nACHError';
        this.message = errorObj.message || 'Uncaught nACHError';
    }
}
exports.default = nACHError;
module.exports = nACHError;
