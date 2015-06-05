import path from 'path';
import os from 'os';
import parseArgs from 'minimist';

var CONSTANTS = {
    PICS_DIR: process.env.npm_package_config_pics_dir,
    CACHE_DIR: process.env.npm_package_config_cache_dir,
    ADAPTED_MAX_WIDTH: 1000,
    ADAPTED_MAX_HEIGHT: 1000,
    THUMBNAIL_MAX_WIDTH: 120,
    THUMBNAIL_MAX_HEIGHT: 120,
    CACHE_BUILDER_WORKERS: os.cpus().length,
    IMAGEMAGICK_PATH: process.env.npm_package_config_imagemagick_path,
    HTTP_PORT: process.env.npm_package_config_port || 4000,
    LOG_FILENAME: 'quick-gallery.log'
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
values.LOG_DIR = path.join(values.CACHE_DIR, 'logs');
values.LOG_PATH = path.join(values.LOG_DIR, values.LOG_FILENAME);

export default values;
