import * as $ from 'jQuery';
import basket from './basket';
import {
    fadeIn, fixAndGetModalBodyHeight, fixAndGetModalBodyWidth
}
from './utils';

export function render($view) {
    var $img = $view.find('.modal-body img');

    function resize() {
        fixAndGetModalBodyWidth($view);
        $img.css('max-height', fixAndGetModalBodyHeight($view));
    }

    $(document).delegate('[data-toggle=gallery]', 'click', function (event) {
        event.preventDefault();

        var $currentPic = $(this);

        $view.modal('show');

        $view.on('shown.bs.modal', () => {
            populate($view, $currentPic);
            resize();
            $view.find('.modal-footer button.next').focus();
        });

        $view.on('hidden.bs.modal', () => populate($view));
    });

    $(document).delegate('.modal-open', 'keydown', (event) => {
        var gallery = $view.data('gallery');
        var $pics = $('[data-gallery="' + gallery + '"]');
        var currentPicIndex = $view.data('currentPicIndex');
        switch (event.which) {
        case 37:
            event.preventDefault();
            displayPreviousPicture($view, $pics, currentPicIndex);
            break;

        case 39:
            event.preventDefault();
            displayNextPicture($view, $pics, currentPicIndex);
            break;

        case 27:
            event.preventDefault();
            $view.modal('hide');
            break;

        default:
            return;
        }
    });

    $view.find('.modal-body img').load(function () {
        fadeIn($(this));
    });

    $(window).ready(resize);
    $(window).resize(resize);
}

function displayPreviousPicture($view, $pics, currentPicIndex) {
    var previousPicIndex = --currentPicIndex;
    var previousPicNode = $pics.get(previousPicIndex);
    if (!previousPicNode) {
        previousPicNode = $pics.get($pics.size() - 1);
    }
    populate($view, $(previousPicNode));
}

function displayNextPicture($view, $pics, currentPicIndex) {
    var nextPicIndex = ++currentPicIndex;
    var nextPicNode = $pics.get(nextPicIndex);
    if (!nextPicNode) {
        nextPicNode = $pics.get(0);
    }
    populate($view, $(nextPicNode));
}

function populate($view, $currentPic) {
    var gallery = '';
    var picTitle = '';
    var picRawPath = '';
    var picPath = '';
    var picHref = '';
    var $pics = $();
    var picsCounter = 0;
    var currentPicIndex = 0;

    if ($currentPic) {
        gallery = $currentPic.data('gallery');
        picTitle = $currentPic.data('title');
        picPath = $currentPic.data('path');
        picRawPath = './pictures/' + $currentPic.data('path');
        picHref = $currentPic.attr('href');
        $pics = $('[data-gallery="' + gallery + '"]');
        picsCounter = $pics.size();
        currentPicIndex = $pics.index($currentPic);
    }

    $view.data('gallery', gallery);
    $view.data('currentPicIndex', currentPicIndex);

    $view.find('.modal-header h4 span.title').text(picTitle);
    $view.find('.modal-header h4 .currentPicIndex').text(currentPicIndex + 1);
    $view.find('.modal-header h4 .picsCounter').text(picsCounter);

    if ($view.find('.modal-body img').attr('src') !== picHref) {
        $view.find('.modal-body img').hide();
        $view.find('.modal-body img').attr('src', picHref);
    }

    $view.find('.modal-footer .currentPicIndex').text(currentPicIndex + 1);
    $view.find('.modal-footer .picsCounter').text(picsCounter);
    $view.find('.modal-footer a.download').attr('href', picRawPath);

    $view.find('.modal-footer button.previous').off();
    $view.find('.modal-footer button.previous').click((e) => {
        e.preventDefault();
        displayPreviousPicture($view, $pics, currentPicIndex);
    });

    $view.find('.modal-footer button.next').off();
    $view.find('.modal-footer button.next').click((e) => {
        e.preventDefault();
        displayNextPicture($view, $pics, currentPicIndex);
    });

    if (basket.isPresent(picPath)) {
        $view.find('.modal-footer button.basket-toggle').button('reset').addClass('active');
    } else {
        $view.find('.modal-footer button.basket-toggle').button('reset').removeClass('active');
    }
    $view.find('.modal-footer button.basket-toggle').off();
    $view.find('.modal-footer button.basket-toggle').click((e) => {
        basket.toggle(picPath);
    });
}
