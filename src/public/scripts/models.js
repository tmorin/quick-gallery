import * as $ from 'jQuery';
import {LocalStorage, Collection, Model} from 'Backbone';

export var Context = Model.extend({
    localStorage: new LocalStorage('Context'),
    initialize() {
        this.set({
            directories: new Directories(),
            basket: new Basket()
        });
    }
});

export var Basket = Model.extend({
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
        var params = $.param({
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

export var Picture = Model.extend({
    idAttribute: 'path'
});

export var Pictures = Collection.extend({
    model: Picture
});

export var Directory = Model.extend({

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

export var Directories = Collection.extend({

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
        var parts = path.split('/');
        var currentPath = this.cwd + parts.shift() + '/';
        var nextPath = parts.join('/');
        var directory = this.get(currentPath);
        if (nextPath) {
            return directory.get('directories').getDirectory(nextPath); 
        }
        return directory;
    }
});
