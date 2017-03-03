import mkdirp from 'mkdirp';
import path from 'path';
import C from './config';
import _gm from 'gm';

const gm = _gm.subClass({
    imageMagick: true,
    appPath: C.IMAGEMAGICK_PATH
});

function resolveScale(w, h, maxW, maxH) {
    let scale = 1;
    let wScale = scale;
    let hScale = scale;
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

function getSize(picPath) {
    return new Promise((resolve, reject) => {
        gm(picPath).size((err, value) => {
            if (err) {
                reject(err);
            } else {
                resolve(value);
            }
        });
    });
}

export default function (picPath, destPath, width, height) {
    return new Promise((resolve, reject) => {
        mkdirp.sync(path.dirname(destPath));
        getSize(picPath).then(function (dim) {
            let scale = 1;
            let newWidth = dim.width;
            let newHeight = dim.height;
            if (width && height) {
                scale = resolveScale(dim.width, dim.height, width, height);
                newWidth = dim.width * scale;
                newHeight = dim.height * scale;
            } else if (width) {
                scale = dim.width / dim.height;
                newWidth = width;
                newHeight = dim.height * scale;
            } else if (height) {
                scale = dim.width / dim.height;
                newWidth = dim.width * scale;
                newHeight = height;
            }

            gm(picPath).autoOrient().resize(newWidth, newHeight).write(destPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(destPath);
                }
            });
        }, reject);
    });
}
