import * as $ from 'jQuery';

class Basket {

    constructor() {
        this.name = '';
        this.pictures = [];
        this.flatten = false;
    }

    isPresent(picPath) {
        return this.pictures.indexOf(picPath) > -1;
    }

    add(picPath) {
        if (this.pictures.indexOf(picPath) < 0) {
            this.pictures.push(picPath);
        }
    }

    remove(picPath) {
        var i = this.pictures.indexOf(picPath);
        if (i > -1) {
            this.pictures.splice(i, 1);
        }
    }

    clear() {
        this.name = '';
        this.pictures = [];
        this.flatten = false;
    }

    toggle(picPath) {
        if (this.isPresent(picPath)) {
            this.remove(picPath);
            return false;
        } else {
            this.add(picPath);
            return true;
        }
    }

    list() {
        return this.pictures.sort();
    }

    download() {
        var params = $.param({
            name: this.name,
            pictures: this.pictures,
            flatten: this.flatten
        });
        window.location = './basket?' + params;
    }

}

var basket = new Basket();

export default basket;
