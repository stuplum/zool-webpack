'use strict';

const errors = require('./errors');
const NotFoundError = errors.NotFoundError;
const CompilationError = errors.CompilationError;

module.exports = function (message) {

    const notFound = message.indexOf('not found') >= 0 || message.indexOf('ENOENT') >= 0;

    return notFound ? new NotFoundError(message) : new CompilationError(message);
};
