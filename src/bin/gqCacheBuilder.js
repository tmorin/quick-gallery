import 'babel/polyfill';
import fs from 'fs';
import parseArgs from 'minimist';
import C from '../lib/config';
import L from '../lib/logger';

var args = parseArgs(process.argv.slice(2));

var clean = args.clean || false;
var thumbnails = args.thumbnails || false;
var adapted = args.adapted || false;

L.info('start to build cache with clean:%s, thumbnails:%s, adapted:%s', clean, thumbnails, adapted);

import * as cacheBuilder from '../lib/cacheBuilder';

var p;

if (clean) {
    p = cacheBuilder.clean(thumbnails, adapted).then(cacheBuilder.prepare);
} else {
    p = cacheBuilder.prepare();
}

p = p.then(cacheBuilder.listAllPictures);

if (thumbnails) {
    p = p.then(cacheBuilder.processThumbnails);
}

if (adapted) {
    p = p.then(cacheBuilder.processAdapted);
}

p.then(() => {
    L.info('cache successfully built');
    process.exit(0);
}, (error) => {
    L.error(error);
    process.exit(1);
});
