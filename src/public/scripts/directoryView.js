import * as $ from 'jQuery';

export function render($el, directory, directories, pictures) {
    renderTitle($el.find('.title'), directory);
    renderDirectories($el.find('.directories'), directories);
    renderPictures($el.find('.pictures'), directory, pictures);
}

function renderTitle($el, directory) {
    $el.empty();

    var parts = directory.path.split('/');
    parts.shift();
    parts.pop();
    parts.unshift('root');

    var currentHref = './';
    parts.map((part) => {
        currentHref = part === 'root' ? currentHref : currentHref + part + '/';
        return $('<li>').append(
            $('<a>')
            .attr('href', '#/directory/' + currentHref)
            .append($('<span>').text(part))
        );
    }).forEach((li) => $el.append(li));
}

function renderDirectories($el, directories) {
    $el.empty();
    directories.map((directory) => {
        return $('<li>').append(
            $('<a>')
            .attr('href', '#/directory/' + directory.path)
            .append($('<div>').addClass('picture').append($('<i>').addClass('fa fa-folder fa-4x')))
            .append($('<div>').addClass('legend small text-mute').text(directory.name))
        );
    }).forEach((a) => $el.append(a));
}

function renderPictures($el, directory, pictures) {
    $el.empty();

    pictures.map((picture) => {
        return $('<li>').append(
            $('<a>')
            .attr('href', './adapted/' + picture.path)
            .attr('data-toggle', 'gallery')
            .attr('data-gallery', directory.name)
            .attr('data-title', picture.name)
            .attr('data-raw', './pictures/' + picture.path)
            .append(
                $('<div>').addClass('picture').append(
                    $('<img>')
                    .attr('src', './thumbnail/' + picture.path)
                    .attr('alt', picture.name)
                    .addClass('img-thumbnail')
                )
            )
            .append(
                $('<div>')
                .addClass('legend small text-mute')
                .text(picture.name)
            )
        );
    }).forEach((li) => $el.append(li));
}
