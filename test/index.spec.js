'use strict';

const Hapi = require('hapi');
const expect = require('chai').expect;

const TempDir = require('zool-test-support').TempDir;

describe('zool-webpack', function () {

    let tempDir = new TempDir('zool-webpack-tests');
    let server;

    tempDir.prepare({ 'dave.js': { 'some-json': 'dave' } });

    after(function (done) {
        tempDir.clean();
        done();
    });

    beforeEach(function (done) {

        server = new Hapi.Server();
        server.connection({ port: 8000 });

        server.register([{ register: require('../'), options: { src: 'test/support' } }], done);
    });

    it('should compile a js file', function (done) {

        server.inject({ method: 'GET', url: '/js/dave.js' }, function (response) {

            expect(response.statusCode).to.be.equal(200);

            expect(response.result).to.contain('// webpackBootstrap');
            expect(response.result).to.contain('console.log(\'dave woz ere\')');

            done();
        });

    });

    it('should compile from a directory with an index file', function (done) {

        server.inject({ method: 'GET', url: '/js/chaz.js' }, function (response) {

            expect(response.statusCode).to.be.equal(200);

            expect(response.result).to.contain('// webpackBootstrap');
            expect(response.result).to.contain('console.log(\'so woz chaz\')');

            done();
        });

    });

    it('should return a 404 if file not found', function (done) {

        server.inject({ method: 'GET', url: '/js/unknown.js' }, function (response) {
            expect(response.statusCode).to.be.equal(404);
            done();
        });

    });

    it('should return a 404 if no index file is found within a directory', function (done) {

        server.inject({ method: 'GET', url: '/js/no-index.js' }, function (response) {
            expect(response.statusCode).to.be.equal(404);
            done();
        });

    });

});
