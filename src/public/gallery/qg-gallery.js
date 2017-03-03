import {element, property, method, toArray} from 'ceb';
import idomify from '../idomify';
import {fromJS} from 'immutable';
import {findDirectory} from '../utils';

element().builders(
    idomify(idomizer`
        <ul>
            <tpl-each items="state.getIn(['breadcrumb'])">
                <li>
                    <a href="#/{{ item.getIn(['path']) }}">{{ item.getIn(['name']) }}</a>
                </li>
                <li>
                    <span>/</span>
                </li>
            </tpl-each>
        </ul>
        <ul>
            <tpl-each items="state.getIn(['directories'])">
                <li>
                    <a href="#/{{ item.getIn(['path']) }}">{{ item.getIn(['name']) }}</a>
                </li>
            </tpl-each>
        </ul>
        <qa-gallery-items items="{{ state.getIn(['pictures']).toJS() }}" />
    `).watch('state', 'current', 'directories', 'pictures'),

    method('createdCallback').invoke(el => {
        el.state = fromJS({});
    }),

    method('show').invoke((el, root, directory) => {
        console.log(el.tagName, 'show', directory);

        const breadcrumb = directory.path.split('/')
            .filter(name => name)
            .reduce((all, name, i) => {
                let directory = root;
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

function createThumbnail(item) {
    return new Promise(resolve => {
        const mPath = item.path;
        const dPath = mPath.substring(0, mPath.lastIndexOf('/') + 1);
        const a = document.createElement('a');
        a.setAttribute('class', 'row-item');
        a.href = `#/${dPath}?media=${mPath}`;

        const img = document.createElement('img');
        a.appendChild(img);
        img.setAttribute('class', 'row-item-thumbnail');
        img.src = `thumbnails/${item.type}/${item.path}`;
        img.alt = `thumbnail of ${item.path}`;
        img.title = item.name;
        img.onload = () => {
            a.dataset.width = img.width;
            a.dataset.height = img.height;
            a.dataset.scale = img.width / img.height;
            a.style.height = '200px';
            resolve(a);
        };
        img.onerror = () => resolve(a);
    });
}

function sizeRow(el, ctx, a) {
    if (!ctx.rows[ctx.cRowIndex]) {
        ctx.rows[ctx.cRowIndex] = document.createElement('div');
        ctx.rows[ctx.cRowIndex].setAttribute('class', 'row');
        el.appendChild(ctx.rows[ctx.cRowIndex]);
    }

    const containerWidth = ctx.rows[ctx.cRowIndex].getBoundingClientRect().width;
    ctx.rows[ctx.cRowIndex].appendChild(a);
    ctx.cRowWidth = ctx.cRowWidth + a.getBoundingClientRect().width;

    if (ctx.cRowWidth > containerWidth) {
        let rate = containerWidth / ctx.cRowWidth;
        toArray(ctx.rows[ctx.cRowIndex].childNodes).forEach(a => {
            const rect = a.getBoundingClientRect();
            a.style.width = Math.floor(rect.width * rate - 2) + 'px';
            a.style.height = Math.floor(rect.height * rate - 2) + 'px';
        });

        ctx.cRowIndex = ctx.cRowIndex + 1;
        ctx.cRowWidth = 0;
    }
}

element().builders(
    property('items')
        .setter((el, items) => {
            el._items = items;
            el.layout();
        })
        .getter(el => {
            return el._items || [];
        }),

    method('layout').invoke(el => {
        el.innerHTML = '';
        const ctx = {
            rows: [],
            cRowIndex: 0,
            cRowWidth: 0
        };

        el.items.reduce((promise, item) => {
            return promise.then(() => {
                return createThumbnail(item).then(a => sizeRow(el, ctx, a));
            })
        }, Promise.resolve()).then(() => {
            const div = document.createElement('div');
            div.setAttribute('class', 'row');
            el.appendChild(div);
        })
    })
).register('qa-gallery-items');

element().builders(
    idomify(idomizer`
        <article>
        </article>
    `).watch('state', 'current', 'directories', 'pictures'),

    method('createdCallback').invoke(el => {
        el.state = fromJS({});
    }),

    method('show').invoke((el, directory, media) => {
        console.log(el.tagName, 'show', directory, media);
    }),
    method('hide').invoke(el => {
    })
).register('qa-player');
