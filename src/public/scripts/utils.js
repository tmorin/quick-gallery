var FADE_DURATION = 200;

export function fadeIn($el) {
    return new Promise((resolve) => {
        $el.fadeIn(FADE_DURATION, () => {
            resolve($el);
        });
    });
}

export function fadeOut($el) {
    return new Promise((resolve) => {
        $el.fadeOut(FADE_DURATION, () => {
            resolve($el);
        });
    });
}

export function findDirectory(path, directories) {
    var parts = path.split('/');
    parts.shift();
    parts.pop();
    parts.unshift('root');

    var directory;

    parts.forEach((name) => {
        directory = directories.filter((directory) => directory.name === name)[0];
        if (directory) {
            directories = directory.directories;
        }
    });

    return directory;
}
