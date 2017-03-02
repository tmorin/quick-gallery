import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import JSZip from 'jszip';
import L from './logger';
import C from './config';
import {scanPictures, scanDirectory} from './scanner';
import * as spawnCacheBuilder from './spawnCacheBuilder';
import * as cacheBuilder from './cacheBuilder';

const app = express();
export default app;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(__dirname + '/../public'));

app.use('/raw/pictures', express.static(C.PICS_DIR));
app.get('/thumbnails/pictures/(*)', (req, res) => {
    const thumbnailPath = path.join(C.THUMBNAIL_DIR, req.params[0]);
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

app.get('/adapted/pictures/(*)', (req, res) => {
    const adaptedPath = path.join(C.ADAPTED_DIR, req.params[0]);
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


app.get('/api/basket', (req, res) => {
    const flatten = req.query.flatten === 'true';
    const name = req.query.name || Date.now();
    const pictures = req.query.pictures || [];
    const zip = new JSZip();
    pictures.forEach((picPath) => {
        let filename = picPath.replace('./', '');
        if (flatten) {
            filename = picPath.replace(/\//g, '_');
        }
        zip.file(filename, fs.readFileSync(C.PICS_DIR + picPath));
    });
    zip.generateAsync({
        type: 'nodebuffer'
    }).then(function (content) {
        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', 'attachment; filename=' + name + '.zip');
        res.send(content);
    });
});

let pictures;
app.get('/api/media', (req, res) => {
    if (pictures && req.query.refresh !== 'true') {
        res.json(pictures);
    } else {
        scanPictures(C.PICS_DIR).then(
            scannedPictures => res.json(scannedPictures[0]),
            error => res.status(500).send(error)
        );
    }
});

app.get('/api/directory/(*)', (req, res) => {
    const directoryPath = (req.params[0] || '.') + '/';
    scanDirectory(C.PICS_DIR, directoryPath).then(
        scannedDirectory => res.json(scannedDirectory),
        error => res.status(500).send(error)
    );
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

