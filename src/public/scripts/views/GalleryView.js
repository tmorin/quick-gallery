import app from "../app";
import {template} from "lodash";
import {View, CollectionView} from "Marionette";
import MediaModalView from "./MediaModalView";
import SitemapModalView from "./SitemapModalView";

const BreadcrumbView = View.extend({
    template: template(`
        <li>
            <a href="" class="sitemap">
                <i class="fa fa-fw fa-sitemap"></i>
            </a>
        </li>
        <%
            items.forEach(function(item, i) {
                if (i < (items.length - 1)) {
        %>
                    <li><a href="#/galleries/<%= item.href %>"><%= item.name %></a></li>
        <%
                } else {
        %>
                    <li><%= item.name %></li>
        <%
                }
        }); %>
    `),
    templateContext() {
        const parts = this.model.get('path').split('/');
        parts.shift();
        parts.pop();
        parts.unshift('root');
        let currentHref = './';
        const items = parts.map((part) => {
            currentHref = part === 'root' ? currentHref : currentHref + part + '/';
            return {
                name: part,
                href: currentHref
            };
        });
        return {
            items: items
        };
    },
    tagName: 'ol',
    className: 'gallery-breadcrumb-view breadcrumb',
    ui: {
        sitemap: 'a.sitemap'
    },
    events: {
        'click @ui.sitemap': 'openSitemap'
    },
    openSitemap(e) {
        e.preventDefault();
        app.getModalRegion().show(new SitemapModalView({
            collection: this.collection
        }));
    }
});

const DirectoryView = View.extend({
    tagName: 'li',
    template: template(`
        <a href="#/galleries/<%= path %>">
            <div class="picture"><i class="fa fa-folder fa-4x"></i></div>
            <div class="legend small text-mute"><%= name %></div>
        </a>
    `)
});

const DirectoriesView = CollectionView.extend({
    tagName: 'ul',
    className: 'gallery-directories-view nav nav-pills',
    childView: DirectoryView
});

const PictureView = View.extend({
    template: template(`
        <a href="./adapted/<%= path %>">
            <div class="picture">
                <img data-original="./thumbnails/<%= path %>" alt="<%= name %>" class="img-thumbnail">
            </div>
            <div class="legend small text-mute"><%= name %></div>
        </a>
    `),
    tagName: 'li',
    ui: {
        a: 'a'
    },
    events: {
        'click @ui.a': 'openMedia'
    },
    openMedia(e) {
        e.preventDefault();
        app.rootView.getRegion('modal').show(new MediaModalView({
            model: this.model,
            collection: this.collection
        }));
    }
});

const PicturesView = CollectionView.extend({
    tagName: 'ul',
    className: 'gallery-pictures-view nav nav-pills',
    childView: PictureView,
    childViewOptions(model) {
        return {
            model: model,
            collection: this.collection
        };
    }
});

export default View.extend({
    template: template(`
        <div id="gallery-breadcrumb"></div>
        <div id="gallery-directories"></div>
        <div id="gallery-pictures"></div>
    `),
    className: 'gallery-view',
    regions: {
        breadcrumb: '#gallery-breadcrumb',
        directories: '#gallery-directories',
        pictures: '#gallery-pictures'
    },
    onBeforeAttach() {
        this.showChildView('breadcrumb', new BreadcrumbView({
            model: this.model,
            collection: this.collection
        }));
        this.showChildView('directories', new DirectoriesView({
            collection: this.model.get('directories')
        }));
        this.showChildView('pictures', new PicturesView({
            collection: this.model.get('pictures')
        }));
    },
    onAttach() {
        this.$el.find('img').lazyload();
    }
});
