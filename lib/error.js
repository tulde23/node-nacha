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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnRkFBZ0Y7QUFDaEYsTUFBcUIsU0FBVSxTQUFRLEtBQUs7SUFDMUMsWUFBWSxRQUE0QztRQUN0RCxLQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxDQUFDO1FBQ2hELElBQUksQ0FBQyxJQUFJLEdBQUcsYUFBYSxRQUFRLENBQUMsSUFBSSxHQUFHLElBQUcsV0FBVyxDQUFDO1FBQ3hELElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQztJQUMxRCxDQUFDO0NBQ0Y7QUFORCw0QkFNQyJ9