import * as $ from 'jQuery';

export function render($view) {
    //var $iframeContainer = $view.find('.iframe-container');

    var $startBtn = $view.find('button.start');
    $startBtn.click(() => {
        $startBtn.attr('disabled', true);
        $.post('./api/cache', {
            clean: window.adminForm.clean.checked,
            thumbnails: window.adminForm.thumbnails.checked,
            adapted: window.adminForm.adapted.checked
        }).then(() => {
            $startBtn.attr('disabled', false);
            $stopBtn.attr('disabled', false);
        }, () => {
            $startBtn.attr('disabled', false);
            $stopBtn.attr('disabled', false);
        });
    });

    var $stopBtn = $view.find('button.stop');
    $stopBtn.click(() => {
        $stopBtn.attr('disabled', true);
        $.ajax({
            type: 'delete',
            url: './api/cache',
            dataType: 'json'
        }).then(() => {
            $startBtn.attr('disabled', false);
            $stopBtn.attr('disabled', false);
        }, () => {
            $startBtn.attr('disabled', false);
            $stopBtn.attr('disabled', false);
        });
    });

    var $statusBtn = $view.find('button.status');
    var $statusLbl = $view.find('.label.status');
    $statusBtn.click(() => {
        $statusBtn.attr('disabled', true);
        $.ajax({
            type: 'get',
            url: './api/cache',
            dataType: 'text'
        }).then((status) => {
          $statusBtn.attr('disabled', false);
          $statusLbl.text(status);
        }, () => {
          $statusBtn.attr('disabled', false);
          $statusLbl.text('?');
        });
    });

    $view.on('shown.bs.modal', () => {
        //$('<iframe>').attr('src', 'api/console').appendTo($iframeContainer);
    });

    $view.on('hidden.bs.modal', () => {
        //$iframeContainer.empty();
    });
}
