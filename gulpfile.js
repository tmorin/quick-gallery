var gulp = require('gulp');
var plumber = require('gulp-plumber');
var babel = require('gulp-babel');
var less = require('gulp-less');

gulp.task('babel-lib', function () {
    return gulp.src(['src/lib/**/*.js'])
        .pipe(plumber())
        .pipe(babel({}))
        .pipe(plumber.stop())
        .pipe(gulp.dest('lib'));
});

gulp.task('babel-bin', function () {
    return gulp.src(['src/bin/**/*.js'])
        .pipe(plumber())
        .pipe(babel({}))
        .pipe(plumber.stop())
        .pipe(gulp.dest('bin'));
});

gulp.task('babel-public', function () {
    return gulp.src(['src/public/**/*.js'])
        .pipe(plumber())
        .pipe(babel({
            modules: 'umd'
        }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('public'));
});

gulp.task('less', function () {
    return gulp.src('src/public/**/*.less')
        .pipe(plumber())
        .pipe(less({}))
        .pipe(plumber.stop())
        .pipe(gulp.dest('public'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch('src/lib/**/*.js', ['babel-lib']);
    gulp.watch('src/bin/**/*.js', ['babel-bin']);
    gulp.watch('src/public/**/*.js', ['babel-public']);
    gulp.watch('src/public/**/*.less', ['less']);
    gulp.watch('gulpfile.js', ['default']);
});

gulp.task('serve', ['watch'], function () {
    require('babel/polyfill');
    var app = require('./lib/app');
    app.listen(4000);
});

gulp.task('build', ['babel-lib', 'babel-bin', 'babel-public', 'less']);

gulp.task('default', ['build']);
