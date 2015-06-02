import fs from 'fs';
import path from 'path';
import util from 'util';
import stream from 'stream';
import express from 'express';
import bodyParser from 'body-parser';
import intercept from 'intercept-stdout';

import C from './config';
import scanPictures from './scanPictures';
import * as spawnCacheBuilder from './spawnCacheBuilder';
import * as cacheBuilder from './cacheBuilder';

fs.writeFileSync(C.CACHE_BUILDER_OUTPUT_FILE, '');

var app = express();
export default app;

app.set('views', 'views');
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/../public'));
app.use('/vendor', express.static('node_modules/'));
app.use('/pictures', express.static(C.PICS_DIR));

app.get('/', (req, res) => res.render('index'));

app.get('/api/pictures', (req, res) => {
    scanPictures(C.PICS_DIR).then(
        (pictures) => res.json(pictures), (error) => res.status(500).send(error)
    );
});

app.post('/api/cache', (req, res) => {
    spawnCacheBuilder.start(req.body).then((code) => {
        util.console('code' + code);
    }, (code) => {
        util.error('code' + code);
    });
    res.sendStatus(202);
});

app.get('/api/cache', (req, res) => {
    if (spawnCacheBuilder.isBusy()) {
        res.send('cache builder is working');
    } else {
        res.send('cache builder is not working');
    }
});

app.delete('/api/cache', (req, res) => {
    spawnCacheBuilder.stop().then(() => {
        res.sendStatus(202);
    }, (error) => {
        res.sendStatus(202);
    });
});

app.get('/api/console', (req, res) => {
    res.status(200).set({
        'content-type': 'text/event-stream'
    });
    var unhook = intercept((data) => res.write(data));
    res.on('close', () => {
        unhook();
    });
});

app.get('/thumbnail/(*)', (req, res) => {
    var thumbnailPath = path.join(C.THUMBNAIL_DIR, req.params[0]);
    fs.lstat(thumbnailPath, function (error, stat) {
        if (error) {
            cacheBuilder.processThumbnails([req.params[0]]).then(() => {
                res.sendFile(req.params[0], {
                    root: C.THUMBNAIL_DIR
                });
            }, () => {
                util.error(error);
                res.sendStatus(500);
            });
        } else {
            res.sendFile(req.params[0], {
                root: C.THUMBNAIL_DIR
            });
        }
    });
});

app.get('/adapted/(*)', (req, res) => {
    var adaptedPath = path.join(C.ADAPTED_DIR, req.params[0]);
    fs.lstat(adaptedPath, function (error, stat) {
        if (error) {
            cacheBuilder.processAdapted([req.params[0]]).then(() => {
                res.sendFile(req.params[0], {
                    root: C.ADAPTED_DIR
                });
            }, () => {
                util.error(error);
                res.sendStatus(500);
            });
        } else {
            res.sendFile(req.params[0], {
                root: C.ADAPTED_DIR
            });
        }
    });
});
