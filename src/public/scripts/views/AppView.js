import {template} from '_';
import app from 'app';
import {LayoutView} from 'Marionette';
import BasketModalView from './BasketModalView';

var NavigationView = LayoutView.extend({
    template: template(`
        <div class="container-fluid">
            <div class="navbar-header">
                <button data-toggle="collapse" data-target="#navbar-collapse" class="navbar-toggle collapsed">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <div class="navbar-brand">QuickGallery</div>
            </div>
            <div id="navbar-collapse" class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <li>
                        <a href="#galleries">
                            <i class="fa fa-fw fa-sitemap"></i><span>Galleries</span>
                        </a>
                    </li>
                    <li>
                        <a href="#admin">
                            <i class="fa fa-fw fa-gear"></i><span>Admin</span>
                        </a>
                    </li>
                    <li>
                        <a href="" class="basket">
                            <i class="fa fa-fw fa-shopping-cart"></i><span>Basket</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    `),
    className: 'navbar navbar-default',
    tagName: 'div',
    ui: {
        basket: 'a.basket'
    },
    events: {
        'click @ui.basket': 'openBasket'
    },
    openBasket(e) {
        e.preventDefault();
        app.rootView.getRegion('modal').show(new BasketModalView({
            model: this.model.get('basket')
        }));
    }
});

export default LayoutView.extend({
    template: template(`
        <div id="navigation"></div>
        <div id="content" class="container-fluid"></div>
    `),
    className: 'app-view',
    regions: {
        navigation: '#navigation',
        content: '#content'
    },
    onBeforeShow: function() {
        this.showChildView('navigation', new NavigationView({
            model: this.model
        }));
    }
});