import * as $ from 'jQuery';
import * as Router from 'Router';
import {
    fadeIn, fadeOut, findDirectory
}
from './utils';
import * as directoriesView from './directoriesView';
import * as directoryView from './directoryView';
import * as pictureView from './pictureView';
import * as adminCacheBuilderView from './adminCacheBuilderView';
import * as adminServerLogsView from './adminServerLogsView';

$.getJSON('./api/pictures').then(function (directories) {

    directoriesView.render($('#directories'), directories);
    pictureView.render($('#picture'));
    adminCacheBuilderView.render($('#adminCacheBuilder'));
    adminServerLogsView.render($('#adminServerLogs'));

    var router = new Router({

        '/directory/(.*)': (path) => {
            var directory = findDirectory(path, directories);
            fadeOut($('.content')).then(($el) => {
                directoryView.render(
                    $('#directory'),
                    directory || {},
                    directory ? directory.directories : [],
                    directory ? directory.pictures : []
                );
                return $el;
            }).then(fadeIn).then(null, (err) => console.error(err));
        }

    });

    router.init('/directory/' + directories[0].path);
});
