import 'babel/polyfill';
import C from '../lib/config';
import L from '../lib/logger';
import app from '../lib/app';

var server = app.listen(C.HTTP_PORT, () => {
    var host = server.address().address;
    var port = server.address().port;
    L.info('quick gallery listening at http://%s:%s', host, port);
});
