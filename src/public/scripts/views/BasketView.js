import {template} from '_';
import {CompositeView, ItemView} from 'Marionette';

var PictureView = ItemView.extend({
    template: template(`
        <div class="media-left media-middle">
            <button class="btn btn-danger btn-xs">
                <i class="fa fa-fw fa-remove"></i>
            </button>
        </div>
        <div class="media-body media-middle">
            <h4 class="media-heading"><%= path %></h4>
        </div>
        <div class="media-right media-middle">
            <img class="media-object" src="./thumbnails/<%= path %>">
        </div>
    `),
    tagName: 'div',
    className: 'media',
    ui: {
        'remove': '.btn.btn-danger'
    },
    events: {
        'click @ui.remove': 'removeMedia'
    },
    removeMedia() {
        this.model.collection.remove(this.model);
    }
});

export default CompositeView.extend({
    template: template(`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4>
                        <i class="text-muted fa fa-fw fa-shopping-cart"></i>
                        Basket
                        <div class="pull-right small text-muted">
                            <a class="text-muted" href="" data-dismiss="modal">
                                <i class="fa fa-fw fa-close"></i>
                            </a>
                        </div>
                    </h4>
                </div>
                <div class="modal-body">
                    <form>
                        <div class="form-group">
                            <labelfor="basketName">Name</label>
                            <input autocomplete="off" class="form-control" id="basketName" name="name" placeholder="the basket's name" value="<%= name %>">
                        </div>
                        <div class=".checkbox">
                            <label>
                                <input autocomplete="off" name="flatten" type="checkbox" <%= flatten?'checked':'' %>>
                                if checked, directories are flatten
                            </label>
                        </div>
                    </form>
                    <div id="basket-pictures"></div>
                </div>
                <div class="modal-footer">
                    <button class="download btn btn-primary" type="button">
                        <i class="fa fa-fw fa-cart-arrow-down"></i>
                    </button>
                </div>
            </div>
        </div>
    `),
    className: 'basket-view modal fade',
    childView: PictureView,
    childViewContainer: '#basket-pictures',
    ui: {
        download: 'button.download',
        name: 'input[name=name]'
    },
    events: {
        'click @ui.download': 'download',
        'shown.bs.modal': 'onShown'
    },
    bindings: {
        'input[name=name]': 'name',
        'input[name=flatten]': 'flatten'
    },
    initialize() {
        this.collection = this.model.get('pictures');
    },
    onRender() {
        this.stickit();
    },
    onShown() {
        this.ui.name.focus();
    },
    download() {
        this.model.download();
    }
});