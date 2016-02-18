'use strict';

const fs = require('fs');
const resolve = require('path').resolve;

const webpack = require('webpack');
const MemoryFS = require('memory-fs');

const zoolLogger = require('zool-utils').ZoolLogger;

const Boom = require('boom');
const Hoek = require('hoek');

const internals = {};

internals.defaults = {
    debug: false,
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

exports.register = function (server, options, next) {

    const logger = zoolLogger('zool-webpack');
    const settings = Hoek.applyToDefaults(internals.defaults, options);

    if (!settings.src) {
        next(new Error('zool-webpack requires "src" directory'));
    }

    function handleErrors(err, reply) {
        logger.error('compile', err);
        reply(Boom.notFound());
    }

    server.route({
        method: 'GET', path: settings.routePath, handler(request, reply) {

            const path = `${__dirname}/dist`;
            const filename = `bundle.${request.params.module}`;

            let entry = `./${request.params.module}`;

            try {
                entry = internals.normaliseFilePath(settings.src, entry.replace('.js', ''));

                const wpConfig = { context: settings.src, entry, output: { path, filename } };
                const compiler = webpack(wpConfig);

                const mfs = new MemoryFS();
                compiler.outputFileSystem = mfs;
                compiler.run((err, stats) => {

                    if (stats.hasErrors()) {
                        handleErrors(stats.toJson().errors[0], reply);
                        return;
                    }

                    logger.log('compile', 'compile success');

                    reply(mfs.readFileSync(`${path}/${filename}`, 'utf-8'));
                });

            } catch (ex) {
                handleErrors(`${path}/${filename} not found`, reply);
            }

        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('../../package.json')
};
