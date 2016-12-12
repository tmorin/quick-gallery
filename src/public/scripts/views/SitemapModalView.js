import {template} from 'lodash';
import {View} from 'Marionette';
import GalleriesTreeView from './GalleriesTreeView';

export default View.extend({
    template: template(`
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4>
                        <i class="text-muted fa fa-fw fa-sitemap"></i>
                        Sitemap
                        <div class="pull-right small text-muted">
                            <a class="text-muted" href="" data-dismiss="modal">
                                <i class="fa fa-fw fa-close"></i>
                            </a>
                        </div>
                    </h4>
                </div>
                <div class="modal-body"></div>
            </div>
        </div>
    `),
    className: 'sitemap-modal-view modal fade',
    regions: {
        'tree': '.modal-body'
    },
    events: {
        'click a': 'closeModal'
    },
    closeModal() {
        this.$el.modal('hide');
    },
    onBeforeAttach() {
        this.showChildView('tree', new GalleriesTreeView({
            collection: this.collection
        }));
    }
});
