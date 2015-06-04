var FADE_DURATION = 200;

export function fadeIn($el) {
    return new Promise((resolve) => {
        $el.fadeIn(FADE_DURATION, () => {
            resolve($el);
        });
    });
}

export function fadeOut($el) {
    return new Promise((resolve) => {
        $el.fadeOut(FADE_DURATION, () => {
            resolve($el);
        });
    });
}

export function findDirectory(path, directories) {
    var parts = path.split('/');
    parts.shift();
    parts.pop();
    parts.unshift('root');

    var directory;

    parts.forEach((name) => {
        directory = directories.filter((directory) => directory.name === name)[0];
        if (directory) {
            directories = directory.directories;
        }
    });

    return directory;
}

function getHeightMargin($el) {
    return parseInt($el.css('margin-top').replace('px', '')) + parseInt($el.css('margin-bottom').replace('px', ''));
}

export function fixAndGetModalBodyHeight($modal) {
    var $content = $modal.find('.modal-content');
    var $dialog = $modal.find('.modal-dialog');
    var $header = $modal.find('.modal-header');
    var $body = $modal.find('.modal-body');
    var $footer = $modal.find('.modal-footer');

    var windowHeight = $(window).height();
    $modal.outerHeight(windowHeight - getHeightMargin($modal));

    var modalHeight = $modal.height();
    $dialog.outerHeight(modalHeight - getHeightMargin($dialog));

    var contentHeight = $dialog.height();
    var headerHeight = $header.outerHeight(true);
    var footerHeight = $footer.outerHeight(true);
    var bodyHeight = contentHeight - headerHeight - footerHeight;

    $body.outerHeight(bodyHeight - getHeightMargin($body));
    return $body.height();
}


export function fixAndGetModalBodyWidth($modal) {
    var $dialog = $modal.find('.modal-dialog');
    var $header = $modal.find('.modal-header');
    var $body = $modal.find('.modal-body');
    var $footer = $modal.find('.modal-footer');

    var modalWidth = $modal.width();
    $dialog.outerWidth(modalWidth);

    return modalWidth;
}
