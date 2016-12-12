import $ from 'jquery';
import {template} from 'lodash';
import {View} from 'Marionette';

const CacheView = View.extend({
    template: template(`
        <div class="panel panel-default">
            <div class="panel-heading">Cache</div>
            <div class="panel-body">
                <button type="button" class="btn btn-default btn-block directories">
                    <i class="fa fa-fw fa-refresh"></i>
                    Refresh directories
                </button>
                <hr>
                <div class="alert-container">
                    <div class="alert alert-info">The cache builder is ready to run.</div>
                </div>
                <form name='cacheForm'>
                    <div class='row">
                        <div class="col-md-6">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" name="thumbnails">
                                    Build thumbnails
                                </label>
                            </div>
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" name="adapted">
                                    Build adapted pictures
                                </label>
                            </div>
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" name="clean">
                                    Clean the selected cache directories before the cache builder process
                                </label>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <button type="button" class="btn btn-default btn-block status">
                                <i class="fa fa-fw fa-refresh"></i>
                                Refresh status
                            </button>
                            <button type="button" class="btn btn-primary btn-block start">
                                <i class="fa fa-fw fa-play"></i>
                                Start the process
                            </button>
                            <button type="button" class="btn btn-danger btn-block stop">
                                <i class="fa fa-fw fa-stop"></i>
                                Stop current process
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `),
    ui: {
        refresh: 'button.directories',
        start: 'button.start',
        stop: 'button.stop',
        status: 'button.status',
        form: 'form[name=cacheForm]',
        alert: '.alert-container'
    },
    events: {
        'click @ui.refresh': 'refreshDirectories',
        'click @ui.start': 'startCacheBuilder',
        'click @ui.stop': 'stopCacheBuilder',
        'click @ui.status': 'checkCacheBuilderStatus'
    },
    refreshDirectories() {
        const i = this.ui.refresh.find('i');
        i.addClass('fa-spin');
        this.collection.fetch({
            reset: true,
            data: {
                refresh: true
            }
        }).then().then(() => i.removeClass('fa-spin'));
    },
    updateStatus(busy) {
        let cssClass = 'alert-danger';
        let message = 'Unable to retrieve the cache builder status.';
        if (busy !== undefined) {
            cssClass = busy ? 'alert-warning' : 'alert-info';
            message = busy ? 'The cache builder is running.' : 'The cache builder is ready to run.';
            if (busy) {
                this.ui.start.attr('disabled', true).find('i').addClass('fa-spin');
            } else {
                this.ui.start.attr('disabled', false).find('i').removeClass('fa-spin');
            }
        }
        this.ui.alert.empty().append($('<div>').addClass('alert ' + cssClass).text(message));
    },
    startCacheBuilder() {
        const data = this.ui.form.serializeObject();
        const self = this;
        this.updateStatus(true);
        $.post('./api/cache', data).then(() => self.checkCacheBuilderStatus(), () => self.checkCacheBuilderStatus());
    },
    stopCacheBuilder() {
        const self = this;
        $.ajax({
            type: 'delete',
            url: './api/cache',
            dataType: 'json'
        }).then(() => self.checkCacheBuilderStatus(), () => self.checkCacheBuilderStatus());
    },
    checkCacheBuilderStatus() {
        const self = this;
        $.ajax({
            type: 'get',
            url: './api/cache',
            dataType: 'json'
        }).then().then((status) => {
            self.updateStatus(status && status.busy);
        });
    },
    onAttach: function () {
        this.checkCacheBuilderStatus();
    }
});

const LogsView = View.extend({
    template: template(`
        <div class="panel panel-default">
            <div class="panel-heading">Logs</div>
            <div class="panel-body">
                <p>
                    <a target="_blank" href="api/logs" class="btn btn-default"><i class="fa fa-fw fa-external-link"></i></a>
                    <button type="button" class="btn btn-default refresh"><i class="fa fa-fw fa-refresh"></i></button>
                </p>
                <pre></pre>
            </div>
        </div>
    `),
    ui: {
        refresh: 'button.refresh',
        pre: 'pre'
    },
    events: {
        'click @ui.refresh': 'refreshLogs'
    },
    refreshLogs() {
        const self = this;
        $.ajax({
            type: 'get',
            url: './api/logs',
            dataType: 'text'
        }).then().then((payload) => self.ui.pre.text(payload));
    },
    onAttach: function () {
        this.refreshLogs();
    }
});

export default View.extend({
    template: template(`
        <div class="row">
            <div class="col-md-6 col-lg-5 admin-cache"></div>
            <div class="col-md-6 col-lg-7 admin-logs"></div>
        </div>
    `),
    className: 'admin-view',
    regions: {
        cache: '.admin-cache',
        logs: '.admin-logs',
    },
    onBeforeAttach: function () {
        this.showChildView('cache', new CacheView({
            collection: this.model.get('directories')
        }));
        this.showChildView('logs', new LogsView());
    }
});
