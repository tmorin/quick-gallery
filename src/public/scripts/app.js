import {history} from "Backbone";
import {template} from "lodash";
import {Application, View, Region} from "Marionette";

const ModalRegion = Region.extend({
    el: '#modal',
    onShow(region, view, options) {
        console.log('onShow', view);
        view.$el.modal('show').on('hidden.bs.modal', () => this.empty());
    },
    onBeforeEmpty(view) {
        view.$el.data('bs.modal', null);
    }
});

const RootView = View.extend({
    template: template(`
        <div id="root"></div>
        <div id="modal"></div>
    `),
    tagName: 'main',
    regions: {
        root: '#root',
        modal: ModalRegion
    }
});

const rootView = new RootView();

const App = Application.extend({
    region: 'body',
    rootView: rootView,
    onBeforeStart() {
        this.showView(rootView);
    },
    getModalRegion() {
        return this.getRegion().currentView.getRegion('modal');
    },
    getRootRegion() {
        return this.getRegion().currentView.getRegion('root');
    }
});

const app = new App();

app.on('start', function (options) {
    history.start();
});

export default app;
