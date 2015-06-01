import glob from 'glob';
/*
function listDirectories(cwd) {
    return new Promise((resolve, reject) => {
        glob('*/', {
            cwd: cwd
        }, function (error, directories) {
            if (error) {
                reject(error);
            } else {
                resolve(directories);
            }
        });
    });
}

function listPictures(cwd) {
    return new Promise((resolve, reject) => {
        glob('*.{jpg,jpeg,png,gif,tif,tiff,bmp,dib,webp}', {
            cwd: cwd
        }, function (error, pictures) {
            if (error) {
                reject(error);
            } else {
                resolve(pictures);
            }
        });
    });
}
*/
function list(cwd, path, name, entries) {

    return new Promise((resolve, reject) => {

        var entry = {
            path: path,
            name: name,
            directories: [],
            pictures: []
        };
        entries.push(entry);

        var dirPromise = new Promise((resolveDir, rejectDir) => {
            glob('*/', {
                cwd: cwd
            }, function (error, subDirNames) {
                if (error) {
                    rejectDir(error);
                } else {
                    var promises = subDirNames.map(function (subDirName) {
                        return list(cwd + subDirName, path + subDirName, subDirName.substring(0, subDirName.length - 1), entry.directories);
                    });
                    Promise.all(promises).then(resolveDir, rejectDir);
                }
            });
        });

        var picPromise = new Promise((resolvePic, rejectPic) => {
            glob('*.{jpg,jpeg,png,gif,tif,tiff,bmp,dib,webp}', {
                cwd: cwd
            }, function (error, subPicNames) {
                if (error) {
                    rejectPic(error);
                } else {
                    entry.pictures = subPicNames.map(function (subPicName) {
                        return {
                            path: path + subPicName,
                            name: subPicName
                        };
                    });
                    resolvePic(entry);
                }
            });
        });

        Promise.all([dirPromise, picPromise]).then(() => resolve(entries), reject);
    });

}

export default function (rootDir) {
    return list(rootDir, './', 'root', []);
}
