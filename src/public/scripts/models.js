import $ from 'jquery';
import {LocalStorage, Collection, Model} from 'Backbone';

export const Context = Model.extend({
    localStorage: new LocalStorage('Context'),
    initialize() {
        this.set({
            directories: new Directories(),
            basket: new Basket()
        });
    }
});

export const Basket = Model.extend({
    defaults: {
        name: '',
        flatten: false
    },
    initialize() {
        this.set({
            pictures: new Pictures([])
        });
    },
    download() {
        let params = $.param({
            name: this.get('name'),
            pictures: this.get('pictures').map((picture) => picture.get('path')),
            flatten: this.get('flatten')
        });
        window.location = './basket?' + params;
        this.set({
            name: '',
            flatten: false
        });
        this.get('pictures').reset();
    }
});

export const Picture = Model.extend({
    idAttribute: 'path'
});

export const Pictures = Collection.extend({
    model: Picture
});

export const Directory = Model.extend({

    idAttribute: 'path',

    initialize() {
        if (Array.isArray(this.get('directories'))) {
            this.set({
                directories: new Directories(this.get('directories'), {
                    cwd: this.id
                })
            });
        }
        if (Array.isArray(this.get('pictures'))) {
            this.set({
                pictures: new Pictures(this.get('pictures'))
            });
        }
    }

});

export const Directories = Collection.extend({

    model: Directory,

    url() {
        return 'api/pictures';
    },

    initialize(coll, options) {
        this.cwd = (options && options.cwd) || '';
    },

    getDirectory(path) {
        if (!path) {
            return;
        }
        const parts = path.split('/');
        const currentPath = this.cwd + parts.shift() + '/';
        const nextPath = parts.join('/');
        const directory = this.get(currentPath);
        if (nextPath) {
            return directory.get('directories').getDirectory(nextPath);
        }
        return directory;
    }
});
