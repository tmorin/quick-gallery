import app from 'app';
import {Context} from './models';
import AppRouter from './AppRouter';
import AppView from 'views/AppView';

app.appCtx = new Context();

var appView = new AppView({
    model: app.appCtx
});

app.appRouter = new AppRouter({
    appCtx: app.appCtx,
    appView: appView
});

app.on('before:start', function(options){
    app.rootView.getRegion('root').show(appView);
});

app.appCtx.get('directories').fetch({
    reset: true
}).then(() => app.start());
