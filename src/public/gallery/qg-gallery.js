import {element, property, method, toArray} from 'ceb';
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
        <qa-gallery-items items="{{ data.getIn(['pictures'], helpers.fromJS([])).toJS() }}" />
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
    property('items').setter((el, items) => {
        el.innerHTML = '';
        const promises = items.map(item => {
            return new Promise(resolve => {
                const mPath = item.path;
                const dPath = mPath.substring(0, mPath.lastIndexOf('/') + 1);
                const a = document.createElement('a');
                a.href = `#/${dPath}?media=${mPath}`;

                const img = document.createElement('img');
                a.appendChild(img);
                img.src = `thumbnails/${item.type}/${item.path}`;
                img.alt = `thumbnail of ${item.path}`;
                img.title = item.name;
                img.onload = () => {
                    img.dataset.width = img.width;
                    img.dataset.height = img.height;
                    resolve(a);
                };
                img.onerror = () => resolve(a);
            });
        });

        const maxWidth = 200;
        const maxHeight = 200;
        const containerWidth = el.getBoundingClientRect().width;
        const rows = [];
        let cRowIndex = 0;
        let cRowWidth = 0;
        promises.forEach((p, i) => p.then(a => {
            const img = a.childNodes[0];
            let itemWidth = parseInt(img.dataset.width);
            let itemHeight = parseInt(img.dataset.height);

            let newRowWidth = cRowWidth + itemWidth;

            if (newRowWidth < containerWidth) {
                cRowWidth = newRowWidth;
            } else {
                cRowIndex++;
                cRowWidth = itemWidth;
            }

            if (!rows[cRowIndex]) {
                const pRow = rows[cRowIndex - 1];
                toArray(pRow.querySelector('img')).forEach(img => {
                    console.log();
                });

                rows[cRowIndex] = document.createElement('div');
                el.appendChild(rows[cRowIndex]);
            }
            rows[cRowIndex].appendChild(a);

            return promises[i];
        }));

    })
).register('qa-gallery-items');

element().builders(
    property('media').setter((el, media) => {
        const img = document.createElement('img');
        img.src = `thumbnails/${media.type}/${media.path}`;
        img.alt = `thumbnail of ${media.path}`;
        img.title = media.name;
        img.onload = () => {
            el.appendChild(img);
        }
    })
).register('qa-thumbnail');

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
