import path from 'path';
import os from 'os';
import parseArgs from 'minimist';

const CONSTANTS = {
    PICS_DIR: null,
    CACHE_DIR: null,
    ADAPTED_MAX_WIDTH: 1000,
    ADAPTED_MAX_HEIGHT: 1000,
    THUMBNAIL_MAX_WIDTH: 200,
    THUMBNAIL_MAX_HEIGHT: 200,
    CACHE_BUILDER_WORKERS: os.cpus().length,
    IMAGEMAGICK_PATH: null,
    HTTP_PORT: 4000,
    LOG_FILENAME: 'quick-gallery.log'
};

function resolveValueFromNpmConfig(defaultValues) {
    return Object.keys(defaultValues).reduce((a, b) => {
        a[b] = process.env['npm_package_config_' + b.toLowerCase()] || defaultValues[b];
        return a;
    }, {});
}

function resolveValueFromEnv(defaultValues) {
    return Object.keys(defaultValues).reduce((a, b) => {
        a[b] = process.env['QUICK_GALLERY_' + b] || defaultValues[b];
        return a;
    }, {});
}

function resolveValueFromArgs(defaultValues, args) {
    const formatedArgs = Object.keys(args).reduce((a, b) => {
        const argName = b.toUpperCase().replace(/-/g, '_');
        a[argName] = args[b];
        return a;
    }, {});
    return Object.keys(defaultValues).reduce((a, b) => {
        a[b] = formatedArgs[b] || defaultValues[b];
        return a;
    }, {});
}

const values = resolveValueFromArgs(resolveValueFromEnv(resolveValueFromNpmConfig(CONSTANTS)), parseArgs(process.argv.slice(2)));

const errors = [];

if (!values.CACHE_DIR || values.CACHE_DIR === 'null') {
    errors.push('QUICK_GALLERY_CACHE_DIR is not defined!');
}

if (!values.PICS_DIR || values.PICS_DIR === 'null') {
    errors.push('QUICK_GALLERY_PICS_DIR is not defined!');
}

if (!values.IMAGEMAGICK_PATH || values.IMAGEMAGICK_PATH === 'null') {
    errors.push('QUICK_GALLERY_IMAGEMAGICK_PATH is not defined!');
}

if (errors.length > 0) {
    throw new Error(`unable to start because:\n${errors.join('\n')}`);
}

values.CACHE_DIR = path.normalize(values.CACHE_DIR + '/').replace(/\\/g, '/');
values.PICS_DIR = path.normalize(values.PICS_DIR + '/').replace(/\\/g, '/');
values.IMAGEMAGICK_PATH = path.normalize(values.IMAGEMAGICK_PATH + '/').replace(/\\/g, '/');
values.THUMBNAIL_DIR = values.CACHE_DIR + 'thumbnail/';
values.ADAPTED_DIR = values.CACHE_DIR + 'adapted/';
values.LOG_DIR = path.join(values.CACHE_DIR, 'logs');
values.LOG_PATH = path.join(values.LOG_DIR, values.LOG_FILENAME);

export default values;
