import mkdirp from 'mkdirp';
import path from 'path';
import C from './config';
import _gm from 'gm';

var gm = _gm.subClass({
    imageMagick: true,
    appPath: C.IMAGEMAGICK_PATH
});

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
            var scale = resolveScale(dim.width, dim.height, width, height);
            gm(picPath).autoOrient().resize(dim.width * scale, dim.height * scale).write(destPath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(destPath);
                }
            });
        }, reject);
    });
}
