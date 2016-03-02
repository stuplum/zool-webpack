'use strict';

const Promise = require('bluebird');

const webpack = require('webpack');
const MemoryFS = require('memory-fs');

const toError = require('./to-error');
const normaliseFilePath = require('./normalise-file-path');

module.exports = {

    compile: function (componentName, config) {

        const path = `${__dirname}/dist`;
        const filename = `bundle.${componentName}`;

        let entry = `./${config.src}/${componentName}`;

        return new Promise((resolve, reject) => {

            try {

                const wpConfig = Object.assign(config, {
                    entry: normaliseFilePath(config.context, entry),
                    output: { path, filename }
                });

                const compiler = webpack(wpConfig);
                const mfs = new MemoryFS();

                compiler.outputFileSystem = mfs;

                compiler.run((err, stats) => {

                    if (stats.hasErrors()) {
                        reject(toError(stats.toJson().errors[0]));
                        return;
                    }

                    resolve(mfs.readFileSync(`${path}/${filename}`, 'utf-8'));

                });

            } catch (ex) {
                reject(toError(ex.message));
            }

        });

    }
};