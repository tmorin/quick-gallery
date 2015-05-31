import glob from 'glob';
import mkdirp from 'mkdirp';
import rimraf from 'rimraf';
import fs from 'fs';
import util from 'util';
import lwip from 'lwip';
import * as C from './constants';

function resolveScale(w, h, maxW, maxH) {
    var scale = 1;
    var wScale = scale;
    var hScale = scale;
    if (w > maxW) {
        wScale = maxW / w;
    }
    if (h > maxH) {
        hScale = maxH / h;
    }
    if (wScale < scale || hScale < scale) {
        scale = wScale > hScale ? hScale : wScale;
    }
    return scale;
}

export function scaleImage(image, destPath, maxW, maxH, stats) {
    return new Promise((resolve, reject) => {
        var w = image.width();
        var h = image.height();
        var scale = resolveScale(w, h, maxW, maxH);
        image.batch().scale(scale, scale).writeFile(destPath, function (error) {
            if (error) {
                util.error(error);
            }
            resolve(destPath);
        });
    });
}

export function openImage(picPath) {
    return new Promise((resolve, reject) => {
        lwip.open(picPath, (error, image) => {
            if (error) {
                reject(error);
            } else {
                resolve(image);
            }
        });
    });
}

function processPicture(picPath, thumbnailPath, stats) {
    return openImage(picPath)
        .then((image) => scaleImage(image, thumbnailPath, C.THUMBNAIL_MAX_WIDTH, C.THUMBNAIL_MAX_HEIGHT, stats))
        .then((destPath) => {
            util.log(util.format('%s/%s - %s written!', --stats.remaingOps, stats.totalOps, destPath));
            return destPath;
        })
        .then(null, (error) => util.error(error));
}

function wrapper(picPath, thumbnailPath, stats) {
    return () => processPicture(picPath, thumbnailPath, stats);
}

export function prepareFs(file) {
    var parts = file.split('/');
    parts.pop();
    var picDir = parts.join('/');
    mkdirp.sync(C.THUMBNAIL_DIR + picDir);
    var picPath = C.PICS_DIR + file;
    var thumbnailPath = C.THUMBNAIL_DIR + file;
    return [picPath, thumbnailPath];
}

export function buildCache(params) {
    return new Promise((resolve, reject) => {
        util.log('------------');

        if (params.clean) {
            util.log(util.format('cleaning %s', C.CACHE_DIR));
            rimraf.sync(C.CACHE_DIR);
            util.log('cleaning done!');
            util.log('------------');
        }

        glob('**/*.{jpg,png,gif}', {
            cwd: C.PICS_DIR,
            nodir: true
        }, function (er, files) {
            if (er) {
                throw er;
            }
            var stats = {
                totalOps: files.length,
                remaingOps: files.length
            };
            util.log(util.format('%s operations to do!', stats.totalOps));
            var pPromise;
            var chunk = 0;
            files.forEach(function (file, fileIndex) {
                chunk++;
                var [picPath, thumbnailPath] = prepareFs(file);
                if (params.update) {
                    var thumbnailStats = fs.lstatSync(thumbnailPath);
                    if (thumbnailStats.isFile()) {
                        --stats.remaingOps;
                        --stats.remaingOps;
                        return;
                    }
                }

                if (pPromise) {
                    if (chunk < C.CACHE_BUILDER_CHUNK_SIZE) {
                        pPromise.then(wrapper(picPath, thumbnailPath, stats));
                    } else {
                        chunk = 0;
                        pPromise = pPromise.then(wrapper(picPath, thumbnailPath, stats));
                    }
                } else {
                    pPromise = processPicture(picPath, thumbnailPath, stats);
                }
            });
            if (pPromise) {
                pPromise.then(() => util.log('operations done!')).then(resolve, reject);
            } else {
                resolve();
            }
        });
    });
}
