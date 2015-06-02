import util from 'util';
import path from 'path';
import os from 'os';
import parseArgs from 'minimist';

var CONSTANTS = {
    PICS_DIR: null,
    CACHE_DIR: null,
    ADAPTED_MAX_WIDTH: 1000,
    ADAPTED_MAX_HEIGHT: 1000,
    THUMBNAIL_MAX_WIDTH: 120,
    THUMBNAIL_MAX_HEIGHT: 120,
    CACHE_BUILDER_WORKERS: os.cpus().length,
    IMAGEMAGICK_PATH: null,
    HTTP_PORT: 4000
};

function resolveValueFromEnv(defaultValues) {
    return Object.keys(defaultValues).reduce((a, b) => {
        a[b] = process.env['QUICK_GALLERY_' + b] || defaultValues[b];
        return a;
    }, {});
}

function resolveValueFromArgs(defaultValues, args) {
    var formatedArgs = Object.keys(args).reduce((a, b) => {
        var argName = b.toUpperCase().replace(/-/g, '_');
        a[argName] = args[b];
        return a;
    }, {});
    return Object.keys(defaultValues).reduce((a, b) => {
        a[b] = formatedArgs[b] || defaultValues[b];
        return a;
    }, {});
}

var values = resolveValueFromArgs(resolveValueFromEnv(CONSTANTS), parseArgs(process.argv.slice(2)));

var errors = [];

if (!values.CACHE_DIR) {
    errors.push('QUICK_GALLERY_CACHE_DIR is not defined!');
}

if (!values.PICS_DIR) {
    errors.push('QUICK_GALLERY_PICS_DIR is not defined!');
}

if (!values.IMAGEMAGICK_PATH) {
    errors.push('QUICK_GALLERY_IMAGEMAGICK_PATH is not defined!');
}

if (errors.length > 0) {
    throw new Error(errors.join('\n'));
}

values.CACHE_DIR = path.normalize(values.CACHE_DIR + '/').replace(/\\/g, '/');
values.PICS_DIR = path.normalize(values.PICS_DIR + '/').replace(/\\/g, '/');
values.IMAGEMAGICK_PATH = path.normalize(values.IMAGEMAGICK_PATH + '/').replace(/\\/g, '/');
values.THUMBNAIL_DIR = values.CACHE_DIR + 'thumbnail/';
values.ADAPTED_DIR = values.CACHE_DIR + 'adapted/';
values.CACHE_BUILDER_OUTPUT_FILE = path.join(values.CACHE_DIR, 'cache_builder_output_file.txt');

Object.keys(values).sort().forEach((key) => {
    util.log(util.format('QUICK_GALLERY_%s: %s', key, values[key]));
});

export default values;