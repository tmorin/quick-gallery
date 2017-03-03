
export function findDirectory(directory, path) {
    if (directory.path === path) {
        return directory;
    } else {
        const nextDirectory = directory.directories.filter(d => path.indexOf(d.path) > -1)[0];
        if (nextDirectory) {
            return findDirectory(nextDirectory, path);
        }
    }
}

export function findMedia(directory, name) {
    return directory.pictures.filter(p => p.name === name)[0];
}
