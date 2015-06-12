import {
    Router
}
from 'Backbone';
import AdminView from './AdminView';
import GalleriesView from './GalleriesView';

export default Router.extend({
    initialize(options) {
            this.appCtx = options.appCtx;
            this.appView = options.appView;
        },
        routes: {
            '': 'welcome',
            'admin': 'admin',
            'galleries': 'welcome',
            'galleries/*path': 'galleries'
        },
        welcome() {
            this.navigate('galleries/' + this.appCtx.get('directories').first().get('path'), {
                trigger: true
            });
        },
        galleries(path) {
            this.appView.showChildView('content', new GalleriesView({
                collection: this.appCtx.get('directories'),
                model: this.appCtx.get('directories').getDirectory(path)
            }));
        },
        admin() {
            this.appView.showChildView('content', new AdminView({
                model: this.appCtx
            }));
        }
});
