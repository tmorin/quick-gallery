import 'babel/polyfill';
import util from 'util';
import parseArgs from 'minimist';

var args = parseArgs(process.argv.slice(2));

var clean = args.clean || false;
var thumbnails = args.thumbnails || false;
var adapted = args.adapted || false;

util.log(util.format('start to build cache with clean:%s, thumbnails:%s, adapted:%s', clean, thumbnails, adapted));

import * as cacheBuilder from '../lib/cacheBuilder';

var p;

if (clean) {
    p = cacheBuilder.clean().then(cacheBuilder.prepare);
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
    util.log('cache successfully built');
    process.exit(0);
}, (error) => {
    util.error(error);
    process.exit(1);
});
