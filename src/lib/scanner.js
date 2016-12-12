import glob from 'glob';
import path from 'path';

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
            cwd: cwd,
            nocase: true
        }, function (error, pictures) {
            if (error) {
                reject(error);
            } else {
                resolve(pictures);
            }
        });
    });
}

function list(cwd, path, name, entries) {

    return new Promise((resolve, reject) => {
        const entry = {
            path: path,
            name: name,
            directories: [],
            pictures: []
        };
        entries.push(entry);

        const dirPromise = listDirectories(cwd).then((subDirNames) => {
            const promises = subDirNames.map(function (subDirName) {
                return list(cwd + subDirName, path + subDirName, subDirName.substring(0, subDirName.length - 1), entry.directories);
            });
            return Promise.all(promises);
        });

        const picPromise = listPictures(cwd).then((subPicNames) => {
            entry.pictures = subPicNames.map(function (subPicName) {
                return {
                    path: path + subPicName,
                    name: subPicName
                };
            });
            return entry;
        });

        Promise.all([dirPromise, picPromise]).then(() => resolve(entries), reject);
    });

}

export function scanPictures(rootDir) {
    return list(rootDir, './', 'root', []);
}
export function scanDirectory(rootDir, cwd) {
    const name = path.basename(cwd);
    const entry = {
       path: cwd,
       name: name === '.' ? 'root' : name
    };
    const dirPromise = listDirectories(path.join(rootDir, cwd)).then(subDirNames => {
        entry.directories = subDirNames.map(function (subDirName) {
            return {
                path: cwd + subDirName,
                name: path.basename(subDirName)
            };
        });
    });
    const picPromise = listPictures(path.join(rootDir, cwd)).then(subPicNames => {
        entry.pictures = subPicNames.map(function (subPicName) {
            return {
                path: cwd + subPicName,
                name: subPicName
            };
        });
    });
    return Promise.all([dirPromise, picPromise]).then(() => entry);
}

