import app from 'app';
import * as $ from 'jQuery';
import {template} from '_';
import {LayoutView} from 'Marionette';
import {fixAndGetModalBodyHeight} from './utils';

export default LayoutView.extend({
    template: template(`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4>
                        <i class="text-muted fa fa-fw fa-file-picture-o"></i>
                        <span class="name"></span>
                        <div class="pull-right small text-muted">
                            <span class="currentPicIndex"></span> / <span class="picsCounter"></span>
                            <a class="text-muted" href="" data-dismiss="modal">
                                <i class="fa fa-fw fa-close"></i>
                            </a>
                        </div>
                    </h4>
                </div>
                <div class="modal-body">
                    <i class="text-muted fa fa-fw fa-spinner fa-spin fa-4x"></i>
                    <img class="img img-responsive img-rounded">
                </div>
                <div class="modal-footer">
                    <button class="basket-toggle btn btn-default" type="button" data-toggle="button" aria-pressed="false" autocomplete="off">
                        <i class="fa fa-fw fa-cart-plus"></i>
                    </button>
                    <a class="download btn btn-default" target="_blank">
                        <i class="fa fa-fw fa-download"></i>
                    </a>
                    <button class="previous btn btn-default" type="button">
                        <i class="fa fa-fw fa-chevron-left"></i>
                    </button>
                    <button class="next btn btn-default" type="button">
                        <i class="fa fa-fw fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `),
    className: 'media-view modal fade expanded',
    ui: {
        'name': '.modal-header .name',
        'currentPicIndex': '.modal-header .currentPicIndex',
        'picsCounter': '.modal-header .picsCounter',
        'img': '.modal-body .img',
        'spinner': '.modal-body i.fa',
        'previous': '.modal-footer button.previous',
        'next': '.modal-footer button.next',
        'download': '.modal-footer a.download',
        'basket': '.modal-footer button.basket-toggle'
    },
    events: {
        'click @ui.next': 'showNext',
        'click @ui.previous': 'showPrevious',
        'click @ui.basket': 'toggleBasket',
        'shown.bs.modal': 'onShown'
    },
    initialize() {
        this.model = this.model;
        this.basketPictures = app.appCtx.get('basket').get('pictures');
    },
    onRender() {
        this.ui.picsCounter.text(this.collection.length);
        var self = this;
        $(document).delegate('.modal-open', 'keydown', (event) => {
            switch (event.which) {
                case 37:
                    event.preventDefault();
                    self.showPrevious();
                    break;
                case 39:
                    event.preventDefault();
                    self.showNext();
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
        this.ui.img.css('max-height', fixAndGetModalBodyHeight(this.$el));
        this.refreshContent();
        this.ui.next.focus();
    },
    refreshContent() {
        this.ui.spinner.show();
        this.ui.img.hide();
        this.ui.currentPicIndex.text(this.collection.indexOf(this.model) + 1);
        this.ui.name.text(this.model.get('name'));
        this.ui.img.load(() => {
            this.ui.spinner.hide();
            this.ui.img.fadeIn(500);
        }).attr('src', './adapted/' + this.model.get('path'));
        this.ui.download.attr('href', './pictures/' + this.model.get('path'));
        if (this.basketPictures.get(this.model.id)) {
            this.ui.basket.button('reset').addClass('active');
        } else {
            this.ui.basket.button('reset').removeClass('active');
        }
    },
    showNext() {
        var currentPicIndex = this.collection.indexOf(this.model);
        var nextPicIndex = ++currentPicIndex;
        var nextPicNode = this.collection.at(nextPicIndex);
        if (!nextPicNode) {
            nextPicNode = this.collection.first();
        }
        if (this.model !== nextPicNode) {
            this.model = nextPicNode;
            this.refreshContent();
        }
    },
    showPrevious() {
        var currentPicIndex = this.collection.indexOf(this.model);
        var nextPicIndex = --currentPicIndex;
        var nextPicNode = this.collection.at(nextPicIndex);
        if (!nextPicNode) {
            nextPicNode = this.collection.last();
        }
        if (this.model !== nextPicNode) {
            this.model = nextPicNode;
            this.refreshContent();
        }
    },
    toggleBasket() {
        var picture = this.basketPictures.get(this.model.id);
        if (picture) {
            this.basketPictures.remove(picture);
        } else {
            this.basketPictures.add(this.model.clone());
        }
    }
});
