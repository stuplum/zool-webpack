'use strict';

const PLUGIN_NAME = 'zool-webpack';

const Boom = require('boom');
const Hoek = require('hoek');

const zoolUtils = require('zool-utils');
const onBoom = zoolUtils.onBoom;
const zoolLogger = zoolUtils.ZoolLogger;
const logger = zoolLogger(PLUGIN_NAME);

const compile = require('../compiler').compile;

const internals = {};

internals.defaults = {
    debug: false,
    routePath: '/js/{module*}'
};

exports.register = function (server, options, next) {

    const settings = Hoek.applyToDefaults(internals.defaults, options);

    if (!settings.src) {
        return next(new Error(`${PLUGIN_NAME} requires "src" to be set`));
    }

    if (!settings.context) {
        return next(new Error(`${PLUGIN_NAME} requires "context" to be set`));
    }

    server.ext('onPreResponse', onBoom((request, reply) => {

        const error = request.response;
        const errorPayload = request.response.output.payload;
        const statusCode = errorPayload.statusCode;
        const replyText = statusCode === 404 ? `${errorPayload.error}: ${request.path}` : error.message;

        logger[statusCode === 404 ? 'warn' : 'error'](errorPayload.error, error.message);

        return reply(replyText).code(statusCode);

    }, PLUGIN_NAME));

    server.route({

        method: 'GET', path: settings.routePath, handler(request, reply) {

            const componentName = request.params.module.replace('.js', '');

            compile(componentName, settings)

                .then(js => {
                    logger.log('compile', `${componentName} compile success`);
                    reply(js);
                })

                .catch(err => {

                    const notFoundError = err.code && err.code === 'NOTFOUND';
                    const error = notFoundError ? 'notFound' : 'internal';

                    reply(Boom[error](err, { from: PLUGIN_NAME }));
                });

        }
    });

    next();
};

exports.register.attributes = {
    pkg: require('../../package.json')
};
