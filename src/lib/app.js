import express from 'express';
import scanPictures from './scanPictures';
import * as cacheBuilder from './cacheBuilder';
import * as C from './constants';
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
    var picPath = C.PICS_DIR + req.params[0];
    var thumbnailPath = C.THUMBNAIL_DIR + req.params[0];
    fs.lstat(thumbnailPath, function (error, stat) {
        if (error) {
            cacheBuilder.prepareFs(req.params[0]);
            cacheBuilder.openImage(picPath)
                .then((image) => cacheBuilder.scaleImage(image, thumbnailPath, C.THUMBNAIL_MAX_WIDTH, C.THUMBNAIL_MAX_HEIGHT))
                .then(() => {
                    res.sendFile(req.params[0], {
                        root: C.THUMBNAIL_DIR
                    });
                }, (error) => util.error(error));
        } else {
            res.sendFile(req.params[0], {
                root: C.THUMBNAIL_DIR
            });
        }
    });
});

app.get('/adapted/(*)', (req, res) => {
    var picPath = C.PICS_DIR + req.params[0];
    var adaptedPath = C.ADAPTED_DIR + req.params[0];
    fs.lstat(adaptedPath, function (error, stat) {
        if (error) {
            cacheBuilder.prepareFs(req.params[0]);
            cacheBuilder.openImage(picPath)
                .then((image) => cacheBuilder.scaleImage(image, adaptedPath, C.ADAPTED_MAX_WIDTH, C.ADAPTED_MAX_HEIGHT))
                .then(() => {
                    res.sendFile(req.params[0], {
                        root: C.ADAPTED_DIR
                    });
                }, (error) => util.error(error));
        } else {
            res.sendFile(req.params[0], {
                root: C.ADAPTED_DIR
            });
        }
    });
});
