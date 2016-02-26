'use strict';

const Hapi = require('hapi');

describe('zool-webpack: missing required options', function () {

    it('should throw error if src property is missing', function (done) {

        const server = new Hapi.Server();
        server.connection({ port: 8000 });

        server.register([{ register: require('../').route, options: { context: 'some/context' } }], function (err) {
            expect(err.message).to.equal('zool-webpack requires "src" to be set');
            done();
        });

    });

    it('should throw error if context property is missing', function (done) {

        const server = new Hapi.Server();
        server.connection({ port: 8000 });

        server.register([{ register: require('../').route, options: { src: 'some/src' } }], function (err) {
            expect(err.message).to.equal('zool-webpack requires "context" to be set');
            done();
        });

    });

    it('should not throw error if src && context properties are defined', function (done) {

        const server = new Hapi.Server();
        server.connection({ port: 8000 });

        server.register([{ register: require('../').route, options: { src: 'some/src', context: 'some/context' } }], function (err) {
            expect(err).to.be.undefined;
            done();
        });

    });
});
