export default class nACHError extends Error {
    constructor(errorObj: {
        message: string;
        name: string;
    });
}
