'use strict';

const entryNameParser = require('../lib/compiler/entry-name-parser');

describe('zool-webpack: entry name parser', function () {

    const temp = new Temp('entry-name-parser');

    temp.create({
        'dave.js': 'console.log(\'dave woz ere\');',
        'chaz.dave.template.js': 'console.log(\'chaz and dave template woz ere\');',
        'chaz.dave.from-func.js': 'console.log(\'chaz and dave from function woz ere\');'
    });

    after(function () {
        temp.cleanUp();
    });

    it('should compile a js file by component name', function () {

        const config = {
            context: temp.baseDir,
            src: temp.location
        };

        const entryName = entryNameParser(config, 'dave');

        expect(entryName).to.be.equal(`./${temp.location}/dave.js`);

    });

    it('should compile a js file by component name template', function () {

        const config = {
            context: temp.baseDir,
            src: temp.location,
            entryNameTemplate: 'chaz.[name].template'
        };

        const entryName = entryNameParser(config, 'dave');

        expect(entryName).to.be.equal(`./${temp.location}/chaz.dave.template.js`);

    });

    it('should compile a js file by component name template when template is a function', function () {

        const config = {
            context: temp.baseDir,
            src: temp.location,
            entryNameTemplate: name => `chaz.${name}.from-func`
        };

        const entryName = entryNameParser(config, 'dave');

        expect(entryName).to.be.equal(`./${temp.location}/chaz.dave.from-func.js`);

    });

});
