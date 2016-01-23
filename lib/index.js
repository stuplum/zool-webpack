'use strict';

const fs = require('fs');
const resolve = require('path').resolve;

const colors = require('colors');
const webpack = require('webpack');
const MemoryFS = require('memory-fs');

const Boom = require('boom');
const Hoek = require('hoek');

colors.setTheme({
    info: 'green',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

const internals = {};

internals.defaults = {
    debug: false,
    src: undefined,
    routePath: '/js/{module*}'
};

internals.normaliseFilePath = function (context, entry) {

    try {
        fs.statSync(resolve(context, entry));
        return entry;
    } catch (ex) {

        if (entry.endsWith('.js')) {
            throw ex;
        }

        return internals.normaliseFilePath(context, `${entry}.js`);
    }
};

internals.log = function log(key, val) {
    console.log(' zool-webpack: ', `${key}: `.gray, val.cyan);
};

internals.debug = function log(key, val) {
    console.log(' zool-webpack: '.debug, `${key}: `.gray, val.cyan);
};

internals.error = function log(key, val) {
    console.error(' zool-webpack: '.error, `${key}: `.gray, val.cyan);
};

internals.warn = function log(key, val) {
    console.error(' zool-webpack: '.warn, `${key}: `.gray, val.cyan);
};

exports.register = function (server, options, next) {

    const settings = Hoek.applyToDefaults(internals.defaults, options);

    if (!settings.src) {
        next(new Error('zool-webpack requires "src" directory'));
    }

    server.route({
        method: 'GET', path: settings.routePath, handler(request, reply) {

            const context = `${process.cwd()}/${settings.src}`;
            const path = `${__dirname}/dist`;
            const filename = `bundle.${request.params.module}`;

            let entry = `./${request.params.module}`;

            try {
                entry = internals.normaliseFilePath(context, entry.replace('.js', ''));

                const wpConfig = {context, entry, output: {path, filename}};
                const compiler = webpack(wpConfig);

                const mfs = new MemoryFS();
                compiler.outputFileSystem = mfs;
                compiler.run(() => {
                    internals.log('compile', 'compile success');
                    reply(mfs.readFileSync(`${path}/${filename}`, 'utf-8'));
                });

            } catch (ex) {
                internals.warn('compile', 'file not found');
                reply(Boom.notFound());
            }

        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('../package.json')
};
