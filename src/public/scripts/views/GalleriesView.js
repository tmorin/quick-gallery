import {template} from '_';
import {LayoutView} from 'Marionette';
import GalleryView from './GalleryView';
import GalleriesTreeView from './GalleriesTreeView';

export default LayoutView.extend({
    template: template(`
        <div class="col-lg-3 col-md-4" id="galleries-tree"></div>
        <div class="col-lg-9 col-md-8" id="galleries-gallery"></div>
    `),
    className: 'galleries',
    ui: {
        tree: '#galleries-tree'
    },
    regions: {
        'tree': '#galleries-tree',
        'gallery': '#galleries-gallery'
    },
    onShow: function() {
        this.showChildView('tree', new GalleriesTreeView({
            collection: this.collection,
            model: this.model
        }));
        this.ui.tree.removeClass('hidden-sm hidden-xs');
        if (this.model) {
            this.ui.tree.addClass('hidden-sm hidden-xs');
            this.showChildView('gallery', new GalleryView({
                model: this.model
            }));
        }
    }
});
