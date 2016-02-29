'use strict';

const fs = require('fs');
const Path = require('path');
const resolve = Path.resolve;

const Promise = require('bluebird');

const webpack = require('webpack');
const MemoryFS = require('memory-fs');


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


function normaliseFilePath(context, entry) {

    try {
        fs.statSync(resolve(context, entry));
        return entry;
    } catch (ex) {

        if (entry.endsWith('.js')) {
            throw ex;
        }

        return normaliseFilePath(context, `${entry}.js`);
    }
}

function statsToError(stats) {
    const message = stats.toJson().errors[0];
    return message.indexOf('not found') === -1 ? new CompilationError(message) : new NotFoundError(message);
}

module.exports = {

    compile: function (componentName, config) {

        const path = `${__dirname}/dist`;
        const filename = `bundle.${componentName}`;

        let entry = `./${config.src}/${componentName}`;

        delete config.src;

        return new Promise((resolve, reject) => {

            try {

                entry = `${normaliseFilePath(config.context, entry)}`;

                const wpConfig = Object.assign(config, {
                    entry,
                    output: {
                        path,
                        filename
                    }
                });

                const compiler = webpack(wpConfig);
                const mfs = new MemoryFS();

                compiler.outputFileSystem = mfs;

                compiler.run((err, stats) => {

                    if (stats.hasErrors()) {
                        reject(statsToError(stats));
                        return;
                    }

                    resolve(mfs.readFileSync(`${path}/${filename}`, 'utf-8'));

                });

            } catch (ex) {
                reject(new NotFoundError(ex.message));
            }

        });

    }
};