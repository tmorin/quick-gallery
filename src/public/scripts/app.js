import * as $ from 'jQuery';
import * as Router from 'Router';
import {
    fadeIn, fadeOut
}
from './utils';
import {
    loadDirectories, findDirectory
}
from './directories';
import * as directoriesView from './directoriesView';
import * as directoryView from './directoryView';
import * as pictureView from './pictureView';
import * as basketView from './basketView';
import * as adminCacheView from './adminCacheView';
import * as adminLogsView from './adminLogsView';

var router = new Router();
router.on('/directory/(.*)', function (path) {
    findDirectory(path).then(directory => {
        fadeOut($('.content')).then($el => {
            directoryView.render(
                $('#directory'),
                directory || {},
                directory ? directory.directories : [],
                directory ? directory.pictures : []
            );
            return $el;
        }).then(fadeIn).then(() => $('img.img-thumbnail', $('#directory')).show().lazyload(), err => console.error(err));
    });
});

loadDirectories().then(directories => {
    directoriesView.render($('#directories'), directories);
    pictureView.render($('#picture'));
    basketView.render($('#basket'));
    adminCacheView.render($('#adminCache'));
    adminLogsView.render($('#adminLogs'));
    if (directories.length > 0) {
        router.init('/directory/' + directories[0].path);
    }
});
