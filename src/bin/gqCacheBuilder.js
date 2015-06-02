import 'babel/polyfill';
import util from 'util';
import fs from 'fs';
import parseArgs from 'minimist';
import intercept from 'intercept-stdout';
import C from '../lib/config';

fs.writeFileSync(C.CACHE_BUILDER_OUTPUT_FILE, '');
var outputFd = fs.openSync(C.CACHE_BUILDER_OUTPUT_FILE, 'a');
var output = fs.createWriteStream(null, {
    fd: outputFd
});
intercept((data) => output.write(data));

var args = parseArgs(process.argv.slice(2));

var clean = args.clean || false;
var thumbnails = args.thumbnails || false;
var adapted = args.adapted || false;

util.log(util.format('start to build cache with clean:%s, thumbnails:%s, adapted:%s', clean, thumbnails, adapted));

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
    util.log('cache successfully built');
    process.exit(0);
}, (error) => {
    util.error(error);
    process.exit(1);
});
