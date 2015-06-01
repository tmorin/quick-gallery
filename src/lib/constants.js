import util from 'util';
import path from 'path';
import os from 'os';

var constants = {
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

var values = Object.keys(constants).reduce((a, b) => {
    a[b] = process.env['QUICK_GALLERY_' + b] || constants[b];
    return a;
}, {});

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

Object.keys(values).sort().forEach((key) => {
    util.log(util.format('QUICK_GALLERY_%s: %s', key, values[key]));
});

export default values;
