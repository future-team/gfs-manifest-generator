# manifest-generator
为前端项目脚手架generator-future-static生成缓存文件。
关于 `manifest` 属性的介绍请参见 [Using_the_application_cache](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache)
# Example
例如这样的 `index.html` 文件,
```html
<!DOCTYPE html>
<html manifest="index.appcache"  lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="description" content="" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no, minimal-ui" />
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no" />
    <title>manifest</title>
    <link rel="stylesheet" href="./index.css?hash=wertyuioityrewqytre&timesnap=46541465465469"/>
    <link rel="stylesheet" href="./common.css"/>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.css" type="text/css"/>
</head>
<body>

    <div id="root"></div>
    <div><img src="./imgs/1.jpg" alt="qweqweqwe"></div>
    <div><img src="http://115.img.pp.sohu.com/images/blog/2007/6/11/6/15/113b04b5b3c.jpg" alt="qweqweqwe"></div>

    <div style="background: url(http://www.dabaoku.com/sucaidatu/dongwu/dongwushijie/015203.JPG)"></div>
    <div style="background: url('http://img-arch.pconline.com.cn/images/upload/upc/tx/wallpaper/1304/15/c0/19877580_1366010662675.jpg')"></div>

    <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    <script src="./common.js"></script>
    <script src="./index.js"></script>
</body>
</html>
```
生成类似于下面的 `index.appcache` 的缓存文件
```　.appcache
CACHE MANIFEST
# origin manifest file
# create at Wed Aug 31 2016 17:56:54 GMT+0800 (CST)
CACHE:
./index.css?hash=wertyuioityrewqytre&timesnap=46541465465469
./common.css
https://cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.css
./imgs/1.jpg
http://115.img.pp.sohu.com/images/blog/2007/6/11/6/15/113b04b5b3c.jpg
https://code.jquery.com/jquery-2.2.4.min.js
./common.js
./index.js
http://www.dabaoku.com/sucaidatu/dongwu/dongwushijie/015203.JPG
http://img-arch.pconline.com.cn/images/upload/upc/tx/wallpaper/1304/15/c0/19877580_1366010662675.jpg
./index.html?1472637414871
NETWORK:
*
```

# Usage 
```javascript
var gulp = require('gulp'),
  manifest = require('gfs-manifest-generator'),
  config = {
    // html files
    html: "./src/html",
    // output
    output: "./dist"
  };
gulp.task('html', function () {
  return gulp.src([config.html + '/**/*.*'])
    .pipe(manifest({
      dir: config.output
    }))
    .pipe(gulp.dest(config.output));
});

gulp.task('default', ['html']);


gulp.task('watch', function () {
  gulp.watch([config.html + '/**/*.*'], function (event) {
    gulp.start('default');
  });
});
```
