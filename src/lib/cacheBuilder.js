import util from 'util';
import fs from 'fs';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import async from 'async';
import glob from 'glob';
import C from './config';
import processPicture from './processPicture';

export function prepare() {
    return new Promise((resolve, reject) => {
        try {
            util.log(util.format('prepare %s', C.CACHE_DIR));
            mkdirp.sync(C.THUMBNAIL_DIR);
            mkdirp.sync(C.ADAPTED_DIR);
            util.log('prepare done!');
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

export function clean(thumbnails, adapted) {
    return new Promise((resolve, reject) => {
        try {
            if (thumbnails) {
                util.log(util.format('clean %s', C.THUMBNAIL_DIR));
                rimraf.sync(C.THUMBNAIL_DIR);
                util.log('clean done!');
            }
            if (adapted) {
                util.log(util.format('clean %s', C.ADAPTED_DIR));
                rimraf.sync(C.ADAPTED_DIR);
                util.log('clean done!');
            }
            resolve();
        } catch (e) {
            reject(e);
        }
    });
}

export function listAllPictures() {
    return new Promise((resolve, reject) => {
        util.log(util.format('list pictures from %s', C.PICS_DIR));
        glob('**/*.{jpg,jpeg,png,gif,tif,tiff,bmp,dib,webp}', {
            cwd: C.PICS_DIR,
            nodir: true
        }, function (e, pictures) {
            if (e) {
                reject(e);
            } else {
                util.log('list done!');
                resolve(pictures);
            }
        });
    });
}

function processPictures(pictures, baseDestPath, width, height) {
    var total = pictures.length;
    var done = 0;
    var processPictureWrapper = (item, callback) => {
        var picPath = C.PICS_DIR + item;
        var destPath = baseDestPath + item;
        ++done;
        util.log(util.format('%s/%s - process %s', total, done, destPath));
        fs.lstat(destPath, (err) => {
            if (err) {
                processPicture(picPath, destPath, width, height).then(() => {
                    util.log(util.format('%s/%s - %s successfully processed!', total, done, destPath));
                    callback();
                }, (err) => {
                    util.error(util.format('%s/%s - %s not processed: %s', total, done, destPath, err));
                    callback(err);
                });
            } else {
                callback();
            }
        });
    };
    return new Promise(function (resolve, reject) {
        var q = async.queue(processPictureWrapper, C.CACHE_BUILDER_WORKERS);
        q.drain = () => {
            q.kill();
            resolve();
        };
        q.push(pictures);
    });
}

export function processThumbnails(pictures) {
    util.log(util.format('process %s thumbnails', pictures.length));
    return processPictures(pictures, C.THUMBNAIL_DIR, C.THUMBNAIL_MAX_WIDTH, C.THUMBNAIL_MAX_HEIGHT).then(() => {
        util.log(util.format('%s thumbnails processed!', pictures.length));
        return pictures;
    });
}

export function processAdapted(pictures) {
    util.log(util.format('process adapted (%s)', pictures.length));
    return processPictures(pictures, C.ADAPTED_DIR, C.ADAPTED_MAX_WIDTH, C.ADAPTED_MAX_HEIGHT).then(() => {
        util.log(util.format('%s adapted processed!', pictures.length));
        return pictures;
    });
}
