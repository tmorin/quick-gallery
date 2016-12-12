import 'jquery-lazyload';
import 'bootstrap/dist/js/bootstrap';
import 'backbone.localstorage';
import 'backbone.stickit';
import '../styles/app.less';
import app from './app';
import {Context} from './models';
import AppRouter from './AppRouter';
import AppView from './views/AppView';

app.appCtx = new Context();

const appView = new AppView({
    model: app.appCtx
});

app.appRouter = new AppRouter({
    appCtx: app.appCtx,
    appView: appView
});

app.on('before:start', function (options) {
    app.getRootRegion().show(appView);
});

app.appCtx.get('directories').fetch({
    reset: true
}).then(() => app.start());
