'use strict';

const Hapi = require('hapi');

describe('zool-webpack: default settings', function () {

    const temp = new Temp('zool-webpack-tests');

    let server;

    temp.create({
        'dave.js': 'console.log(\'dave woz ere\');',
        'chaz/index.js': 'console.log(\'so woz chaz\');',
        'no-index/not-index.js': 'console.log(\'no can haz index\');',
        'no-compile.js': 'var broken = { some ;'
    });

    after(function (done) {
        temp.cleanUp();
        done();
    });

    beforeEach(function (done) {

        const wpConfig = {
            context: temp.baseDir,
            src: temp.location
        };

        server = new Hapi.Server();
        server.connection({ port: 8000 });

        server.register([{ register: require('../').route, options: wpConfig }], done);
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

    it('should return a 500 if file does not compile', function (done) {

        server.inject({ method: 'GET', url: '/js/no-compile.js' }, function (response) {
            expect(response.statusCode).to.be.equal(500);
            done();
        });

    });

});
