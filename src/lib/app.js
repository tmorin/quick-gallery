import express from 'express';
import scanPictures from './scanPictures';
import * as cacheBuilder from './cacheBuilder';
import * as C from './constants';
import path from 'path';
import fs from 'fs';
import util from 'util';

var app = express();
export default app;

app.set('views', 'views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/../public'));
app.use('/vendor', express.static('node_modules/'));
app.use('/pictures', express.static(C.PICS_DIR));

app.get('/', (req, res) => res.render('index'));

app.get('/api/pictures', (req, res) => {
    scanPictures(C.PICS_DIR).then(
        (pictures) => res.json(pictures), (error) => res.status(500).send(error)
    );
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
                res.send(500);
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
                res.send(500);
            });
        } else {
            res.sendFile(req.params[0], {
                root: C.ADAPTED_DIR
            });
        }
    });
});
