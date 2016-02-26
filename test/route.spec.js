'use strict';

const Hapi = require('hapi');

describe('zool-webpack: route', function () {

    const temp = new Temp('zool-webpack-route');

    let server;

    before(function () {
        temp.create({
            'not-important/index.js': 'console.log("not important");'
        });
    });

    after(function () {
        temp.cleanUp();
        rimraf.sync(publicDir);
    });

    beforeEach(function (done) {

        server = new Hapi.Server();
        server.connection({ port: 8000 });

        server.register([{ register: require('../').route, options: { context: temp.baseDir, src: `${temp.location}` } }], done);
    });

    it('should be exported', function (done) {

        server.inject({ method: 'GET', url: '/js/not-important.js' }, function (response) {
            expect(response.statusCode).to.be.equal(200);
            done();
        });

    });

});
