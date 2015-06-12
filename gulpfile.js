var gulp = require('gulp');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var less = require('gulp-less');
var jshint = require('gulp-jshint');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var wrapper = require('gulp-wrapper');
var merge = require('merge-stream');

var LessPluginCleanCSS = require('less-plugin-clean-css');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var cleancss = new LessPluginCleanCSS({
    advanced: true
});
var autoprefix = new LessPluginAutoPrefix({
    browsers: ['last 2 versions']
});
var lessPlugins = [autoprefix];
if (process.env.NODE_ENV === 'production') {
    lessPlugins.push(cleancss);
}

gulp.task('jshint', function () {
    gulp.src(['src/**/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('jshint-unblocked', function () {
    gulp.src(['src/**/*.js'])
        .pipe(plumber())
        .pipe(jshint('.jshintrc'))
        .pipe(plumber.stop())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('babel-lib', function () {
    return gulp.src(['src/lib/**/*.js'])
        .pipe(plumber())
        .pipe(babel())
        .pipe(plumber.stop())
        .pipe(gulp.dest('lib'));
});

gulp.task('babel-bin', function () {
    return gulp.src(['src/bin/**/*.js'])
        .pipe(plumber())
        .pipe(babel())
        .pipe(plumber.stop())
        .pipe(wrapper({
            header: '#!/usr/bin/env node\n\n'
        }))
        .pipe(gulp.dest('bin'));
});

gulp.task('babel-public', function () {
    return gulp.src([
            'src/public/scripts/utils.js',
            'src/public/scripts/models.js',
            'src/public/scripts/app.js',
            'src/public/scripts/views/AdminView.js',
            'src/public/scripts/views/MediaView.js',
            'src/public/scripts/views/BasketView.js',
            'src/public/scripts/views/GalleryView.js',
            'src/public/scripts/views/GalleriesTreeView.js',
            'src/public/scripts/views/GalleriesView.js',
            'src/public/scripts/views/AppView.js',
            'src/public/scripts/AppRouter.js',
            'src/public/scripts/bootstrap.js'
        ])
        .pipe(plumber())
        .pipe(babel({
            modules: 'umd'
        }))
        .pipe(plumber.stop())
        .pipe(concat('app.js'))
        .pipe(gulpif(process.env.NODE_ENV === 'production', uglify()))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task('styles', function () {
    return gulp.src('src/public/**/*.less')
        .pipe(plumber())
        .pipe(less({
            plugins: lessPlugins,
            paths: ['.']
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('public'));
});

gulp.task('components', function () {
    var scripts = gulp.src([
            'node_modules/babel/node_modules/babel-core/browser-polyfill.js',
            'node_modules/jquery/dist/jquery.js',
            'node_modules/jquery-lazyload/jquery.lazyload.js',
            'node_modules/jquery-lazyload/jquery.scrollstop.js',
            'node_modules/form-serializer/jquery.serialize-object.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'node_modules/lodash/index.js',
            'node_modules/backbone/backbone.js',
            'node_modules/backbone.localstorage/backbone.localStorage.js',
            'node_modules/backbone.stickit/backbone.stickit.js',
            'node_modules/backbone.marionette/lib/backbone.marionette.js'
        ])
        .pipe(concat('components.js'))
        .pipe(gulpif(process.env.NODE_ENV === 'production', uglify()))
        .pipe(gulp.dest('public/scripts'));

    var styles = gulp.src([
            'node_modules/font-awesome/less/font-awesome.less',
            'node_modules/bootstrap/less/bootstrap.less',
            'node_modules/bootstrap/less/theme.less'
        ])
        .pipe(plumber())
        .pipe(less({
            plugins: lessPlugins,
            paths: ['.']
        }))
        .pipe(plumber.stop())
        .pipe(concat('components.css'))
        .pipe(gulp.dest('public/styles'));

    var fonts = gulp.src([
            'node_modules/font-awesome/fonts/**/*',
            'node_modules/bootstrap/fonts/**/*'
        ])
        .pipe(gulp.dest('public/fonts'));

    return merge(scripts, styles, fonts);
});

gulp.task('watch', ['build'], function () {
    gulp.watch('src/lib/**/*.js', ['jshint-unblocked', 'babel-lib']);
    gulp.watch('src/bin/**/*.js', ['jshint-unblocked', 'babel-bin']);
    gulp.watch('src/public/**/*.js', ['jshint-unblocked', 'babel-public']);
    gulp.watch('src/public/**/*.less', ['styles']);
    gulp.watch('gulpfile.js', ['components', 'babel-lib', 'babel-bin', 'babel-public', 'styles']);
});

gulp.task('serve', ['watch'], function () {
    require('./lib/server');
});

gulp.task('build', ['jshint', 'components', 'babel-lib', 'babel-bin', 'babel-public', 'styles']);

gulp.task('default', ['build']);
