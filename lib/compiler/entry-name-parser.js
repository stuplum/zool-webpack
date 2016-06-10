'use strict';

const statSync = require('fs').statSync;
const resolve = require('path').resolve;

const DEFAULT_ENTRY_NAME_TEMPLATE = '[name]';
const DEFAULT_REPLACE_SYMBOL = '[name]';

function normaliseFilePath(context, entry) {

    try {
        statSync(resolve(context, entry));
        return entry;
    } catch (ex) {

        if (entry.endsWith('.js')) {
            throw ex;
        }

        return normaliseFilePath(context, `${entry}.js`);
    }
}

function parseComponentName(config, componentName) {

    switch (typeof config.entryNameTemplate) {
        case 'function':
            componentName = config.entryNameTemplate(componentName);
            break;
        case 'string':
            componentName = config.entryNameTemplate.replace(DEFAULT_REPLACE_SYMBOL, componentName);
            break;
        default:
            componentName = DEFAULT_ENTRY_NAME_TEMPLATE.replace(DEFAULT_REPLACE_SYMBOL, componentName);
            break;
    }

    return componentName;
}

module.exports = function entryNameParser(config, componentName) {
    return normaliseFilePath(config.context, `./${config.src}/${parseComponentName(config, componentName)}`);
};
