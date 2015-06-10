import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import JSZip from 'jszip';

import L from './logger';
import C from './config';
import scanPictures from './scanPictures';
import * as spawnCacheBuilder from './spawnCacheBuilder';
import * as cacheBuilder from './cacheBuilder';

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

app.get('/basket', (req, res) => {
    var flatten = req.query.flatten === 'true';
    var name = req.query.name || Date.now();
    var pictures = req.query.pictures || [];
    var zip = new JSZip();
    pictures.forEach((picPath) => {
        var filename = picPath.replace('./', '');
        if (flatten) {
            filename = picPath.replace(/\//g, '_');
        }
        zip.file(filename, fs.readFileSync(C.PICS_DIR + picPath));
    });
    var buffer = zip.generate({
        type: 'nodebuffer'
    });
    res.set('Content-Type', 'application/zip');
    res.set('Content-Disposition', 'attachment; filename=' + name + '.zip');
    res.send(buffer);
});

var pictures;
app.get('/api/pictures', (req, res) => {
    if (pictures && req.query.refresh !== 'true') {
        res.json(pictures);
    } else {
        scanPictures(C.PICS_DIR).then(
            scannedPictures => {
                pictures = scannedPictures;
                res.json(pictures);
            }, error => res.status(500).send(error)
        );
    }
});

app.get('/api/cache', (req, res) => {
    res.json({
        busy: spawnCacheBuilder.isBusy()
    });
});

app.post('/api/cache', (req, res) => {
    spawnCacheBuilder.start(req.body).then(() => res.sendStatus(202), error => res.sendStatus(202));
});

app.delete('/api/cache', (req, res) => {
    spawnCacheBuilder.stop().then(() => {
        res.sendStatus(202);
    }, (error) => {
        L.error(error);
        res.sendStatus(202);
    });
});

app.get('/api/logs', (req, res) => {
    res.sendFile(L.transports['all-file'].filename, {
        root: C.LOG_DIR
    });
});

app.get('/thumbnails/(*)', (req, res) => {
    var thumbnailPath = path.join(C.THUMBNAIL_DIR, req.params[0]);
    fs.lstat(thumbnailPath, function (error, stat) {
        if (error) {
            cacheBuilder.processThumbnails([req.params[0]]).then(() => {
                res.sendFile(req.params[0], {
                    root: C.THUMBNAIL_DIR
                });
            }, () => {
                L.error(error);
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
            }, (e) => {
                L.error(e);
                res.sendStatus(500);
            });
        } else {
            res.sendFile(req.params[0], {
                root: C.ADAPTED_DIR
            });
        }
    });
});
