import {history} from 'Backbone';
import {Application, LayoutView, Region} from 'Marionette';

var ModalRegion = Region.extend({
    el: '#modal',
    onShow(view) {
        var self = this;
        view.$el.modal('show').on('hidden.bs.modal', function () {
            self.empty();
        });
    },
    onBeforeEmpty(view) {
        view.$el.data('bs.modal', null);
    }
});

var RootView = LayoutView.extend({
    el: 'body',
    regions: {
        root: '#root',
        modal: ModalRegion
    }
});

var app = new Application();

app.rootView = new RootView();

app.on('start', function(options){
    history.start();
});

export default app;
