var gulp = require('gulp');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var less = require('gulp-less');
var jshint = require('gulp-jshint');
var gulpif = require('gulp-if');
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var wrapper = require('gulp-wrapper');

var minimist = require('minimist');
var options = minimist(process.argv.slice(2), {});

var LessPluginCleanCSS = require('less-plugin-clean-css'); 
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var cleancss = new LessPluginCleanCSS({ advanced: true });
var autoprefix= new LessPluginAutoPrefix({ browsers: ["last 2 versions"] });
var lessPlugins = [autoprefix];
if (options.env === 'production') {
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
            'src/public/scripts/directoriesView.js',
            'src/public/scripts/directoryView.js',
            'src/public/scripts/pictureView.js',
            'src/public/scripts/adminCacheBuilderView.js',
            'src/public/scripts/adminServerLogsView.js',
            'src/public/scripts/app.js'
        ])
        .pipe(plumber())
        .pipe(babel({
            modules: 'umd'
        }))
        .pipe(plumber.stop())
        .pipe(concat('app.js'))
        .pipe(gulpif(options.env === 'production', uglify()))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task('scripts-vendors', function () {
    return gulp.src([
            'node_modules/jquery/dist/jquery.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'node_modules/director/build/director.js'
        ])
        .pipe(concat('vendors.js'))
        .pipe(gulpif(options.env === 'production', uglify()))
        .pipe(gulp.dest('public/scripts'));
});

gulp.task('fonts-vendors', function () {
    return gulp.src('node_modules/font-awesome/fonts/**/*')
        .pipe(gulp.dest('public/fonts'));
});

gulp.task('less', function () {
    return gulp.src('src/public/**/*.less')
        .pipe(plumber())
        .pipe(less({
            plugins: lessPlugins,
            paths: ['.']
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('public'));
});

gulp.task('styles-vendors', function () {
    return gulp.src([
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
        .pipe(concat('vendors.css'))
        .pipe(gulp.dest('public/styles'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch('src/lib/**/*.js', ['jshint-unblocked', 'babel-lib']);
    gulp.watch('src/bin/**/*.js', ['jshint-unblocked', 'babel-bin']);
    gulp.watch('src/public/**/*.js', ['jshint-unblocked', 'babel-public']);
    gulp.watch('src/public/**/*.less', ['less']);
    gulp.watch('gulpfile.js', ['default']);
});

gulp.task('serve', ['watch'], function () {
    require('./lib/server');
});

gulp.task('build', ['jshint', 'styles-vendors', 'scripts-vendors', 'fonts-vendors', 'babel-lib', 'babel-bin', 'babel-public', 'less']);

gulp.task('default', ['build']);
