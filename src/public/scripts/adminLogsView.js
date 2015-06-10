import * as $ from 'jQuery';
import {
    fixAndGetModalBodyHeight, fixAndGetModalBodyWidth
}
from './utils';

export function render($view) {

    var $refreshBtn = $view.find('button.refresh');
    var $pre = $view.find('pre');

    function resize() {
        fixAndGetModalBodyWidth($view);
        $pre.outerHeight(fixAndGetModalBodyHeight($view));
    }

    function renderLogs(logs) {
        $pre.text(logs);
        resize();
    }

    $refreshBtn.click((e) => {
        e.preventDefault();
        getLogs().then(renderLogs, renderLogs);
    });

    $view.on('shown.bs.modal', () => {
        getLogs().then(renderLogs, renderLogs);
        $refreshBtn.focus();
    });

    $view.on('shown.bs.modal', () => {});

    $(window).ready(resize);
    $(window).resize(resize);
}

function getLogs() {
    return $.ajax({
        type: 'get',
        url: './api/logs',
        dataType: 'text'
    });
}
