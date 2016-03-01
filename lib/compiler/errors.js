'use strict';

function NotFoundError(message) {
    this.name = 'NotFoundError';
    this.code = 'NOTFOUND';
    this.message = message;
    this.stack = (new Error()).stack;
}
NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;

function CompilationError(message) {
    this.name = 'CompilationError';
    this.code = 'COMPILE';
    this.message = message;
    this.stack = (new Error()).stack;
}
CompilationError.prototype = Object.create(Error.prototype);
CompilationError.prototype.constructor = CompilationError;

module.exports = {
    NotFoundError,
    CompilationError
};
