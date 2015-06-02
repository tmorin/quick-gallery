import util from 'util';
import childProcess from 'child_process';

var ref;

export function isBusy() {
    return !!ref;
}

export function start(args = []) {
    if (ref) {
        throw new Error('a cache builder process is aldready started!');
    }

    var formattedArgs = Object.keys(args).reduce(function (a, b) {
        if (args[b] && args[b] !== 'false') {
            a.push('--' + b);
        }
        return a;
    }, []);

    util.log('start a cache builder process');

    return new Promise((resolve, reject) => {
        ref = childProcess.fork('bin/gqCacheBuilder.js', formattedArgs, {
            silent: false,
            stdio: ['pipe', process.out, process.out]
        });
        ref.on('close', function (code) {
            util.log('the cache builder process is finished');
            try {
                ref.unref();
                ref = null;
            } catch (e) {
                util.error(e);
            }
            if (code === 0) {
                resolve(code);
            } else {
                reject(code);
            }
        });
    });
}

export function stop(args) {
    if (!ref) {
        throw new Error('no cache builder process in progress!');
    }
    util.log('stop the cache builder process');
    ref.kill('SIGINT');
    return new Promise((resolve, reject) => {
        ref.on('close', function (code) {
            util.log('the cache builder has been interupted');
            try {
                ref.unref();
                ref = null;
            } catch (e) {
                util.error(e);
            }
            if (code === 0) {
                resolve();
            } else {
                reject(code)
            }
        });
    });
}
