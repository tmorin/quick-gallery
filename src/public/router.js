import qs from 'qs';

const routes = [];

function process(hash = window.location.hash) {
    const value = hash.replace(/^#/, '');
    const i = value.indexOf('?');
    const path = i > 0 ? value.substring(0, value.indexOf('?')) : value;
    const queryParams = qs.parse(i > 0 ? value.substring(value.indexOf('?') + 1) : '');
    for (let i = 0; i < routes.length; i++) {
        const groups = routes[i].regex.exec(path);
        if (groups) {
            groups.shift();
            return routes[i].callback(path, groups, queryParams);

        }
    }
}

function listener(evt) {
    evt.preventDefault();
    process();
}

export default function route(regex, callback) {
    routes.push({regex, callback})
}

route.start = hash => {
    window.addEventListener('hashchange', listener);
    if (window.location.hash) {
        process(window.location.hash);
    } else {
        window.location.hash = hash;
    }
};

route.stop = () => {
    window.removeEventListener('hashchange', listener);
};
