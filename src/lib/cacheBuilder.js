import fs from 'fs';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import async from 'async';
import glob from 'glob';
import C from './config';
import processPicture from './processPicture';
import L from './logger';

export function prepare() {
    L.profile('cache builder -> prepare');
    return new Promise((resolve, reject) => {
        try {
            L.info('prepare %s', C.CACHE_DIR);
            mkdirp.sync(C.THUMBNAIL_DIR);
            mkdirp.sync(C.ADAPTED_DIR);
            L.info('prepare done!');
            resolve();
        } catch (e) {
            reject(e);
        }
        L.profile('cache builder -> prepare');
    });
}

export function clean(thumbnails, adapted) {
    L.profile('cache builder -> clean');
    return new Promise((resolve, reject) => {
        try {
            if (thumbnails) {
                L.info('clean %s', C.THUMBNAIL_DIR);
                rimraf.sync(C.THUMBNAIL_DIR);
                L.info('clean done!');
            }
            if (adapted) {
                L.info('clean %s', C.ADAPTED_DIR);
                rimraf.sync(C.ADAPTED_DIR);
                L.info('clean done!');
            }
            resolve();
        } catch (e) {
            reject(e);
        }
        L.profile('cache builder -> clean');
    });
}

export function listAllPictures() {
    L.profile('cache builder -> list all pictures');
    return new Promise((resolve, reject) => {
        L.info('list pictures from %s', C.PICS_DIR);
        glob('**/*.{jpg,jpeg,png,gif,tif,tiff,bmp,dib,webp}', {
            cwd: C.PICS_DIR,
            nodir: true,
            nocase: true
        }, function (e, pictures) {
            L.profile('cache builder -> list all pictures');
            if (e) {
                reject(e);
            } else {
                L.info('list done!');
                resolve(pictures);
            }
        });
    });
}

function processPictures(pictures, baseDestPath, width, height) {
    L.profile('cache builder -> process pictures');
    var total = pictures.length;
    var done = 0;
    var processPictureWrapper = (item, callback) => {
        var picPath = C.PICS_DIR + item;
        var destPath = baseDestPath + item;
        ++done;
        L.info('%s/%s - process %s', total, done, destPath);
        fs.lstat(destPath, (err) => {
            if (err) {
                processPicture(picPath, destPath, width, height).then(() => {
                    L.info('%s/%s - %s successfully processed!', total, done, destPath);
                    callback();
                }, (err) => {
                    L.error('%s/%s - %s not processed: %s', total, done, destPath, err);
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
            L.profile('cache builder -> process pictures');
            q.kill();
            resolve();
        };
        q.push(pictures);
    });
}

export function processThumbnails(pictures) {
    L.info('process %s thumbnails', pictures.length);
    return processPictures(pictures, C.THUMBNAIL_DIR, C.THUMBNAIL_MAX_WIDTH, C.THUMBNAIL_MAX_HEIGHT).then(() => {
        L.info('%s thumbnails processed!', pictures.length);
        return pictures;
    });
}

export function processAdapted(pictures) {
    L.info('process adapted (%s)', pictures.length);
    return processPictures(pictures, C.ADAPTED_DIR, C.ADAPTED_MAX_WIDTH, C.ADAPTED_MAX_HEIGHT).then(() => {
        L.info('%s adapted processed!', pictures.length);
        return pictures;
    });
}
