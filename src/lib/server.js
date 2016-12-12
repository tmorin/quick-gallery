import C from './config';
import L from './logger';
import app from './app';

const server = app.listen(C.HTTP_PORT, () => {
    const host = server.address().address;
    const port = server.address().port;
    L.info('quick gallery listening at http://%s:%s', host, port);
});
