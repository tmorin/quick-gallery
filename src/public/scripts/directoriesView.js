import * as $ from 'jQuery';

export function render($el, directories) {
    renderTree($el.find('.tree'), directories);
    $el.delegate('a', 'click', (event) => $el.modal('hide'));
}

function renderTree($el, directories) {
    $el.empty();

    directories.map((directory) => {
        return $('<li>')
            .append($('<a>').attr('href', '#/directory/' + directory.path).append($('<span>').text(directory.name)))
            .append($('<i>').addClass('fa fa-fw'))
            .append($('<small>').addClass('text-muted').text(directory.pictures.length + ' pictures'))
            .append(renderTree($('<ul>'), directory.directories));
    }).forEach((li) => $el.append(li));

    return $el;
}
