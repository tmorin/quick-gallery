import util from 'util';


var constants = {
    PICS_DIR: process.env.HOME + '/Pictures/',
    CACHE_DIR: process.env.HOME + '/tmp/qg_cache/',
    ADAPTED_MAX_WIDTH: 1000,
    ADAPTED_MAX_HEIGHT: 1000,
    THUMBNAIL_MAX_WIDTH: 120,
    THUMBNAIL_MAX_HEIGHT: 120,
    CACHE_BUILDER_CHUNK_SIZE: 3,
    HTTP_PORT: 4000
};

var values = Object.keys(constants).reduce((a, b) => {
    a[b] = process.env['QUICK_GALLERY_' + b] || constants[b];
    util.log(util.format('QUICK_GALLERY_%s: %s', b, a[b]));
    return a;
}, {});

values.THUMBNAIL_DIR = values.CACHE_DIR + 'thumbnail/';
values.ADAPTED_DIR = values.CACHE_DIR + 'adapted/';

export default values;
