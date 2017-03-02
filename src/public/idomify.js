import {assign, property, method} from 'ceb';
import {fromJS} from 'immutable';
import IncrementalDOM from 'incremental-dom';

function hasChanged(map1, map2, path) {
    let keyPath = path.split('.');
    let v1 = (map1 && map1.getIn(keyPath));
    let v2 = (map2 && map2.getIn(keyPath));
    let areEquals = v1 === v2;
    if (v1 && typeof v1.equals === 'function') {
        areEquals = v1.equals(v2);
    }
    return !areEquals;
}
class Builder {

    constructor(render = noop()) {
        this.data = {
            render,
            helpers: {fromJS},
            listeners: []
        };
    }

    helpers(helpers) {
        assign(this.data.helpers, helpers);
        return this;
    }

    listen(...properties) {
        this.data.listeners = this.data.listeners.concat(properties);
        return this;
    }

    watch(key, ...paths) {
        this.data.watcher = {key, paths};
        return this;
    }

    build(proto, on) {
        let data = this.data;

        function toImmutable(value) {
            return !value || value['@@__IMMUTABLE_ITERABLE__@@'] ? value : fromJS(value);
        }

        function createState(el) {
            return data.listeners
                .map(key => ([key, el[key]]))
                .reduce((state, [key, value]) => state.set(key, toImmutable(value)), fromJS({}));
        }

        method('render').invoke((el, state) => {
            IncrementalDOM.patch(el, data.render(IncrementalDOM, data.helpers), state || createState(el));
        }).build(proto, on);

        data.listeners.forEach(key => property(key).listen(el => el.render()).build(proto, on));

        if (data.watcher) {
            property(data.watcher.key).listen((el, oldVal, newVal) => {
                oldVal = toImmutable(oldVal);
                newVal = toImmutable(newVal);
                let shouldRender = data.watcher.paths.reduce((r, path) => r || hasChanged(oldVal, newVal, path), false);
                if (shouldRender) {
                    el.render(newVal);
                }
            }).build(proto, on);
            on('before:createdCallback').invoke(el => el.render(el[data.watcher.key]));
        }
    }

}

export default function idomify(render) {
    return new Builder(render);
}
