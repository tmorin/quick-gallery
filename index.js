require('babel/polyfill');
var C = require('./lib/constants');
var app = require('./lib/app');
var server = app.listen(C.HTTP_PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('quick gallery listening at http://%s:%s', host, port);
});
