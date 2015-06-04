import * as $ from 'jQuery';

export function render($view) {

    function renderCacheStatus(status) {
        var cssClass = 'alert-danger';
        var message = 'Unable to retrieve the cache builder status.';
        if (status && status.hasOwnProperty('busy')) {
            cssClass = status.busy ? 'alert-warning' : 'alert-info';
            message = status.busy ? 'The cache builder is running.' : 'The cache builder is ready to run.';
        }
        if (status && status.busy) {
            $startBtn.attr('disabled', true).find('i').addClass('fa-spin');
        } else {
            $startBtn.attr('disabled', false).find('i').removeClass('fa-spin');
        }
        $view.find('.alert-container').empty().append($('<div>').addClass('alert ' + cssClass).text(message));
    }

    var $startBtn = $view.find('button.start');
    var $stopBtn = $view.find('button.stop');
    var $statusBtn = $view.find('button.status');

    $startBtn.click(() => {
        startCacheBuilder().then(() => {
            getCacheBuilderStatus().then(renderCacheStatus, renderCacheStatus);
        }, () => {
            getCacheBuilderStatus().then(renderCacheStatus, renderCacheStatus);
        });
        getCacheBuilderStatus().then(renderCacheStatus, renderCacheStatus);
    });

    $stopBtn.click(() => {
        stopCacheBuilder().then(() => {
            getCacheBuilderStatus().then(renderCacheStatus, renderCacheStatus);
        }, () => {
            getCacheBuilderStatus().then(renderCacheStatus, renderCacheStatus);
        });
    });

    $statusBtn.click(() => {
        getCacheBuilderStatus().then(renderCacheStatus, renderCacheStatus);
    });

    $view.on('shown.bs.modal', () => {
        getCacheBuilderStatus().then(renderCacheStatus, renderCacheStatus);
    });

}

function startCacheBuilder() {
    return $.post('./api/cache', {
        clean: window.adminForm.clean.checked,
        thumbnails: window.adminForm.thumbnails.checked,
        adapted: window.adminForm.adapted.checked
    });
}

function stopCacheBuilder() {
    return $.ajax({
        type: 'delete',
        url: './api/cache',
        dataType: 'json'
    });
}

function getCacheBuilderStatus() {
    return $.ajax({
        type: 'get',
        url: './api/cache',
        dataType: 'json'
    });
}
