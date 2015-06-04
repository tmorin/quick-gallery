import winston from 'winston';
import mkdirp from 'mkdirp';
import path from 'path';
import C from './config';

mkdirp.sync(path.dirname(C.LOG_PATH));

var root = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            name: 'all-console',
            colorize: true,
            prettyPrint: true,
            timestamp: true,
            humanReadableUnhandledException: true
        }),
        new(winston.transports.DailyRotateFile)({
            name: 'all-file',
            colorize: false,
            prettyPrint: true,
            timestamp: true,
            json: false,
            humanReadableUnhandledException: true,
            maxFiles: 2,
            filename: C.LOG_PATH
        })
    ]
});

Object.keys(C).sort().forEach((key) => {
    root.info('QUICK_GALLERY_%s: %s', key, C[key]);
});

export default root;
