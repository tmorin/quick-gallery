import * as $ from 'jQuery';

var directories;

function getDirectory(path) {
    var parts = path.split('/');
    parts.shift();
    parts.pop();
    parts.unshift('root');

    var currentDirectory;

    var currentDirectories = directories;
    parts.forEach((name) => {
        currentDirectory = currentDirectories.filter((directory) => directory.name === name)[0];
        if (currentDirectory) {
            currentDirectories = currentDirectory.directories;
        }
    });

    return currentDirectory;
}

export function loadDirectories() {
    return $.getJSON('./api/pictures').then((payload) => directories = payload);
}

export function findDirectory(path) {
    if (directories) {
        return new Promise(resolve => resolve(getDirectory(path)));
    }
    return loadDirectories().then(() => findDirectory(path));
}
