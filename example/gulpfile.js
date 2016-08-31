var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);
var clean = require('gulp-rimraf');
var open = require('gulp-open');
var config = {
    css: "./css",
    js: "./js",
    html: "./html",
    output: "./dist"
};
var manifest = require('../index');

gulp.task('open', function () {
    gulp.src(__filename)
        .pipe(open({uri: 'file://'+__dirname + '/dist/index.html', app: 'Google Chrome'}));
});

gulp.task('css', function () {
    return gulp.src([config.css + '/**/*.*'])
        .pipe(gulp.dest(config.output, {
            overwrite: true
        }));
});

gulp.task('js', function () {
    return gulp.src([config.js + '/**/*.*'])
        .pipe(gulp.dest(config.output, {
            overwrite: true
        }));
});

gulp.task('html', function () {
    return gulp.src([config.html + '/**/*.*'])
        .pipe(manifest({
            dir: config.output
        }))
        .pipe(gulp.dest(config.output, {
            overwrite: true
        }));
});

gulp.task('default', function(){
    runSequence(['js', 'css'], 'html', 'open');
});