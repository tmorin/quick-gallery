import 'babel/polyfill';
import util from 'util';
import C from '../lib/config';
import app from '../lib/app';

var server = app.listen(C.HTTP_PORT, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log('quick gallery listening at http://%s:%s', host, port);
});
