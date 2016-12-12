import "babel/polyfill";
import parseArgs from "minimist";
import L from "../lib/logger";
import * as cacheBuilder from "../lib/cacheBuilder";

const args = parseArgs(process.argv.slice(2));

const clean = args.clean || false;
const thumbnails = args.thumbnails || false;
const adapted = args.adapted || false;

let p;

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
}, error => {
    L.error(error);
    process.exit(1);
});
