import {element, method} from 'ceb';
import idomify from '../idomify';
import {fromJS} from 'immutable';

function findDirectory(directory = [], path = './') {
    if (directory.path === path) {
        return directory;
    } else {
        const nextDirectory = directory.directories.filter(d => path.indexOf(d.path) > -1)[0];
        if (nextDirectory) {
            return findDirectory(nextDirectory, path);
        }
    }
}

function findMedia(directory, name) {
    return directory.pictures.filter(p => p.name === name)[0];
}

element().builders(
    idomify(idomizer`
        <ul>
            <tpl-each items="data.getIn(['breadcrumb'])">
                <li>
                    <a href="#/{{ item.getIn(['path']) }}">
                        <tpl-text value="item.getIn(['name'])" />
                    </a>
                </li>
                <li>
                    <span>/</span>
                </li>
            </tpl-each>
        </ul>
        <ul>
            <tpl-each items="data.getIn(['directories'])">
                <li>
                    <a href="#/{{ item.getIn(['path']) }}">
                        <tpl-text value="item.getIn(['name'])" />
                    </a>
                </li>
            </tpl-each>
        </ul>
        <ul>
            <tpl-each items="data.getIn(['pictures'])">
                <li>
                    <a href="#/{{ data.getIn(['current', 'path']) }}?media={{ item.getIn(['name']) }}">
                        <img src="thumbnails/pictures/{{ item.getIn(['path']) }}" alt="thumbnails of {{ item.getIn(['path']) }}" title="{{ item.getIn(['name']) }}" />
                    </a>
                </li>
            </tpl-each>
        </ul>
    `).watch('state', 'current', 'directories', 'pictures'),

    method('createdCallback').invoke(el => {
        el.state = fromJS({});
    }),

    method('show').invoke((el, path) => {
        const directory = findDirectory(el.root, path);

        console.log(el.tagName, 'show', directory);

        const breadcrumb = directory.path.split('/')
            .filter(name => name)
            .reduce((all, name, i) => {
                let directory = el.root;
                if (i > 0) {
                    directory = findDirectory(directory, all[i - 1].path + name + '/');
                }
                return all.concat([directory]);
            }, []);

        const current = {
            path: directory.path,
            name: directory.name
        };

        el.state = el.state.withMutations(state => {
            state
                .set('breadcrumb', fromJS(breadcrumb))
                .set('current', fromJS(current))
                .set('directories', fromJS(directory.directories))
                .set('pictures', fromJS(directory.pictures));
        });
    })
).register('qa-gallery');


element().builders(
    idomify(idomizer`
        <article>
        </article>
    `).watch('state', 'current', 'directories', 'pictures'),

    method('createdCallback').invoke(el => {
        el.state = fromJS({});
    }),

    method('show').invoke((el, path, name) => {
        const directory = findDirectory(el.root, path);
        const media = findMedia(directory, name);
        console.log(el.tagName, 'show', directory, media);
    }),
    method('hide').invoke(el => {
    })
).register('qa-player');
