import childProcess from 'child_process';
import L from './logger';

let ref;

export function isBusy() {
    return !!ref;
}

export function start(args = []) {
    const formattedArgs = Object.keys(args).reduce(function (a, b) {
        if (args[b] && args[b] !== 'false') {
            a.push('--' + b);
        }
        return a;
    }, []);
    return new Promise((resolve, reject) => {
        if (ref) {
            reject(new Error('a cache builder process is in in progress!'));
        } else {
            L.info('start a cache builder process');
            ref = childProcess.fork('bin/qg-cache-builder.js', formattedArgs, {
                silent: true
            });
            ref.on('close', function (code) {
                L.info('the cache builder process is finished');
                ref = null;
                if (code === 0) {
                    resolve(code);
                } else {
                    reject(new Error('the cache builder process failed: ' + code));
                }
            });
        }
    });
}

export function stop(args) {
    return new Promise((resolve, reject) => {
        if (!ref) {
            reject(new Error('no cache builder process in progress!'));
        } else {
            L.info('stop the cache builder process');
            ref.kill('SIGINT');
            ref.on('close', function (code) {
                L.info('the cache builder has been interupted');
                ref = null;
                if (code === 0 || code === null) {
                    resolve();
                } else {
                    reject(new Error('the cache builder process failed: ' + code));
                }
            });
        }
    });
}
