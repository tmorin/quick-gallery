import 'babel/polyfill';
import util from 'util';
import parseArgs from 'minimist';

var args = parseArgs(process.argv.slice(2));

util.log(util.format('start to build cache with clean:%s, update:%s', args.clean || false, args.update || false));

import {buildCache} from '../lib/cacheBuilder';

buildCache(args).then(() => process.exit(0), (error) => {
    util.error(error);
    process.exit(1);
});
