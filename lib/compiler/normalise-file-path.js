'use strict';

const statSync = require('fs').statSync;
const resolve = require('path').resolve;

function normaliseFilePath(context, entry) {

    try {
        statSync(resolve(context, entry));
        return entry;
    } catch (ex) {

        if (entry.endsWith('.js')) {
            throw ex;
        }

        return normaliseFilePath(context, `${entry}.js`);
    }
}

module.exports = normaliseFilePath;
