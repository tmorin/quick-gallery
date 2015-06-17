import {
    template
}
from '_';
import {
    CollectionView, CompositeView
}
from 'Marionette';

var GalleriesTreeItemView = CompositeView.extend({
    template: template(`
        <% if (directories.length) { %>
        <a class="icon" href=""><i class="fa-li fa fa-folder-open-o"></i></a>
        <% } %>
        <a href="#/galleries/<%= path %>"><%= name %></a>
        <small class="text-muted">(<%= pictures.length %>)</small>
        <ul class="fa-ul"></ul>
    `),
    tagName: 'li',
    childViewContainer: 'ul',
    ui: {
        'directories': 'ul',
        'icon': '.icon'
    },
    events: {
        'click @ui.icon': 'toggleDirectory'
    },
    childViewOptions() {
        return {
            current: this.current
        };
    },
    initialize(option) {
        this.current = option.current;
        this.collection = this.model.get('directories');
    },
    toggleDirectory(e) {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.ui.directories.toggleClass('hide');
        this.ui.icon.find('.fa').toggleClass('fa-folder-o fa-folder-open-o');
    }
});

export default CollectionView.extend({
    childView: GalleriesTreeItemView,
    className: 'galleries-tree-view fa-ul',
    tagName: 'ul',
    collectionEvents: {
        'reset': 'render'
    },
    childViewOptions() {
        return {
            current: this.model
        };
    },
    onRender() {
        if (this.model) {
            var id = this.model.id;
            var current = this;
            while (current) {
                current = current.children.filter((view) => {
                    return view.model.get('directories').some((dir) => id.indexOf(dir.id) === 0);
                })[0];
                if (current) {
                    current.toggleDirectory();
                }
            }
        }
    }
});
