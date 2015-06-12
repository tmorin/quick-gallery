import * as $ from 'jQuery';

function getHeightMargin($el) {
    return parseInt($el.css('margin-top').replace('px', '')) + parseInt($el.css('margin-bottom').replace('px', ''));
}

export function fixAndGetModalBodyHeight($modal) {
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
