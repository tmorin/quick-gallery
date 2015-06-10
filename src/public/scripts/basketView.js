import * as $ from 'jQuery';
import basket from './basket';

export function render($view) {
    var $nameInput = $view.find('input[name=name]');
    var $flattenInput = $view.find('input[name=flatten]');
    var $downloadBtn = $view.find('button.download');
    var $mediaContainer = $view.find('.media-container');

    $nameInput.change(() => basket.name = $nameInput.val());
    $flattenInput.change(() => basket.flatten = $flattenInput.prop('checked'));

    $view.on('shown.bs.modal', () => {
        renderBasket();
        $nameInput.focus();
    });

    $downloadBtn.click(() => {
        basket.download();
        basket.clear();
        $nameInput.val(basket.name);
        $flattenInput.prop('checked', basket.flatten);
        renderBasket();
    });

    function renderBasket() {
        $mediaContainer.empty();
        basket.list().map(createBasketLine).forEach(media => $mediaContainer.append(media));
    }

    function createBasketLine(picPath) {
        return $('<div>').addClass('media')
            .append(
                $('<div>').addClass('media-left media-middle').append(
                    $('<button>')
                    .click(() => {
                        basket.remove(picPath);
                        renderBasket();
                    })
                    .addClass('btn btn-danger btn-xs')
                    .data('picPath', picPath)
                    .append($('<i>').addClass('fa fa-fw fa-remove'))
                )
            )
            .append(
                $('<div>').addClass('media-body media-middle')
                .append(
                    $('<h4>').addClass('media-heading').text(picPath)
                )
            )
            .append(
                $('<div>').addClass('media-right media-middle').append(
                    $('<img>').addClass('media-object').attr('src', './thumbnails/' + picPath)
                )
            );
    }

}
