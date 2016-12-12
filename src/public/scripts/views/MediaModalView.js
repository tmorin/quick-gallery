import $ from "jquery";
import {template} from "lodash";
import {Collection} from "Backbone";
import {CompositeView, View} from "Marionette";
import app from "../app";
import {fixAndGetModalBodyHeight} from "../utils";

const HeaderView = View.extend({
    template: template(`
        <h4>
            <i class="text-muted fa fa-fw fa-file-picture-o"></i>
            <%= name %>
            <div class="pull-right small text-muted">
                <%= currentPicIndex %> / <%= picsCounter %>
                <a class="text-muted" href="" data-dismiss="modal">
                    <i class="fa fa-fw fa-close"></i>
                </a>
            </div>
        </h4>
    `),
    templateContext() {
        return {
            currentPicIndex: this.model.collection.indexOf(this.model) + 1,
            picsCounter: this.model.collection.length
        };
    }
});

const BodyView = View.extend({
    template: template(`
        <i class="text-muted fa fa-fw fa-spinner fa-spin fa-4x"></i>
        <img class="img img-responsive img-rounded" src="./adapted/<%= path %>">
    `),
    ui: {
        img: 'img.img',
        spinner: 'i.fa'
    },
    onRender() {
        this.ui.img.css('max-height', this.options.maxHeight);
        this.ui.img.hide().one('load', () => {
            this.ui.spinner.hide();
            this.ui.img.fadeIn(500);
        });
    }
});

const FooterThumbnailView = View.extend({
    template: template(`
        <% if(disabled) { %>
            <img src="./thumbnails/<%= path %>" alt="<%= name %>" class="img-responsive selected">
        <% } else { %>
            <a href=""><img src="./thumbnails/<%= path %>" alt="<%= name %>" class="img-responsive"></a>
        <% } %>
    `),
    templateContext() {
        return {
            disabled: this.options.current.id === this.model.id
        };
    },
    tagName: 'li',
    triggers: {
        'click a': {
            event: 'show:media',
            preventDefault: true,
            stopPropagation: false
        }
    }
});

const FooterThumbnailsView = CompositeView.extend({
    template: template(``),
    tagName: 'ul',
    className: 'list-inline',
    childView: FooterThumbnailView,
    childViewOptions() {
        return {
            current: this.model
        };
    },
    initialize() {
        let index = this.model.collection.indexOf(this.model);
        let beforeIndex = Math.max(index - 3, 0);
        let afterIndex = Math.min(index + 4, this.model.collection.length);
        let before = this.model.collection.slice(beforeIndex, index);
        let after = this.model.collection.slice(index, afterIndex);
        let collection = before.concat([this.model]).concat(after);
        this.collection = new Collection(collection);
    }
});

const FooterActionsView = View.extend({
    template: template(`
        <button class="basket btn btn-default <%= active ? 'active' : '' %>" type="button" data-toggle="button" aria-pressed="false" autocomplete="off">
            <i class="fa fa-fw fa-cart-plus"></i>
        </button>
        <a class="download btn btn-default" href="./pictures/<%= path %>" target="_blank">
            <i class="fa fa-fw fa-download"></i>
        </a>
        <button class="previous btn btn-default" type="button">
            <i class="fa fa-fw fa-chevron-left"></i>
        </button>
        <button class="next btn btn-default" type="button">
            <i class="fa fa-fw fa-chevron-right"></i>
        </button>
    `),
    templateContext() {
        return {
            active: !!this.options.basketPictures.get(this.model.id)
        };
    },
    triggers: {
        'click button.next': {
            event: 'show:next:media',
            preventDefault: true,
            stopPropagation: false
        },
        'click button.previous': {
            event: 'show:previous:media',
            preventDefault: true,
            stopPropagation: false
        },
        'click button.basket': {
            event: 'toggle:basket',
            preventDefault: true,
            stopPropagation: false
        }
    },
    onShowNextMedia() {
        let currentPicIndex = this.model.collection.indexOf(this.model);
        let nextPicIndex = ++currentPicIndex;
        let nextPicNode = this.model.collection.at(nextPicIndex);
        if (!nextPicNode) {
            nextPicNode = this.model.collection.first();
        }
        if (this.model !== nextPicNode) {
            this.model = nextPicNode;
            this.triggerMethod('show:media', nextPicNode);
        }
    },
    onShowPreviousMedia() {
        let currentPicIndex = this.model.collection.indexOf(this.model);
        let nextPicIndex = --currentPicIndex;
        let nextPicNode = this.model.collection.at(nextPicIndex);
        if (!nextPicNode) {
            nextPicNode = this.model.collection.last();
        }
        if (this.model !== nextPicNode) {
            this.model = nextPicNode;
            this.triggerMethod('show:media', nextPicNode);
        }
    },
    onToggleBasket() {
        let picture = this.options.basketPictures.get(this.model.id);
        if (picture) {
            this.options.basketPictures.remove(picture);
        } else {
            this.options.basketPictures.add(this.model.clone());
        }
    }
});

export default View.extend({
    template: template(`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header"></div>
                <div class="modal-body"></div>
                <div class="modal-footer">
                    <div class="pull-left thumbnails hidden-xs"></div>
                    <div class="actions"></div>
                </div>
            </div>
        </div>
    `),
    className: 'media-modal-view modal fade expanded',
    regions: {
        header: '.modal-header',
        body: '.modal-body',
        thumbnails: '.thumbnails',
        actions: '.actions'
    },
    ui: {
        'next': '.modal-footer button.next'
    },
    events: {
        'shown.bs.modal': 'onShown'
    },
    onRender() {
        let self = this;
        $(document).delegate('.modal-open', 'keydown', (event) => {
            switch (event.which) {
                case 37:
                    event.preventDefault();
                    self.getRegion('actions').currentView.onShowPreviousMedia();
                    break;
                case 39:
                    event.preventDefault();
                    self.getRegion('actions').currentView.onShowNextMedia();
                    break;
                case 27:
                    event.preventDefault();
                    self.$el.modal('hide');
                    break;
                default:
                    return;
            }
        });
    },
    onDestroy() {
        $(document).undelegate('.modal-open', 'keydown');
    },
    onShown() {
        this.refreshContent();
        this.ui.next.focus();
    },
    onChildviewShowMedia(data) {
        this.model = data.model;
        this.refreshContent();
    },
    refreshContent() {
        this.showChildView('header', new HeaderView({
            model: this.model
        }));
        this.showChildView('thumbnails', new FooterThumbnailsView({
            model: this.model
        }));
        this.showChildView('actions', new FooterActionsView({
            model: this.model,
            basketPictures: app.appCtx.get('basket').get('pictures')
        }));
        this.showChildView('body', new BodyView({
            model: this.model,
            maxHeight: fixAndGetModalBodyHeight(this.$el)
        }));
    }
});
