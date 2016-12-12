import $ from 'jquery';

function getHeightMargin($el) {
    return parseInt($el.css('margin-top').replace('px', '')) + parseInt($el.css('margin-bottom').replace('px', ''));
}

export function fixAndGetModalBodyHeight($modal) {
    const $dialog = $modal.find('.modal-dialog');
    const $header = $modal.find('.modal-header');
    const $body = $modal.find('.modal-body');
    const $footer = $modal.find('.modal-footer');

    const windowHeight = $(window).height();
    $modal.outerHeight(windowHeight - getHeightMargin($modal));

    const modalHeight = $modal.height();
    $dialog.outerHeight(modalHeight - getHeightMargin($dialog));

    const contentHeight = $dialog.height();
    const headerHeight = $header.outerHeight(true);
    const footerHeight = $footer.outerHeight(true);
    const bodyHeight = contentHeight - headerHeight - footerHeight;

    $body.outerHeight(bodyHeight - getHeightMargin($body));
    return $body.height();
}
