# manifest-generator

# Usage 
```javascript
var gulp = require('gulp'),
    manifest = require('gfs-manifest-generator'),
    config = {
       // html files
       html:"./src/html",
       // output
       output: ci.dist
     };
gulp.task('html', function () {
    return gulp.src([config.html+ '/**/*.*'])
        .pipe(manifest({
            dir: config.output
        }))
        .pipe(gulp.dest(config.output));
});

gulp.task('default', ['html']);


gulp.task('watch', function() {
    gulp.watch([config.html+ '/**/*.*'], function(event) {
      gulp.start('default');
    });
});
```
