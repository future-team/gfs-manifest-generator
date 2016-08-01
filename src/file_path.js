/**
 * 根据 html 文件分析出与该页面相关的所有静态文件
 * css 文件 注: 分析预处理之后的文件
 * js 文件 注: 依赖文件,一般都有专门的配置文件
 * 图片 注: html文件的引用 、css文件中的引用
 * Created by dpDev on 16/7/15.
 */
"use strict";
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var through2 = require('through2');
var renderCacheFile = require('./render');

// 读取文件 根据{{{}}}读取所有的静态文件列表
// 要排除掉 {{{facade ...}}}
function getLinkByMark(ctnStr){
    var links = [],
        linkArr = ctnStr && ctnStr.match(OPTIONS.REG_MARK) || [];
    linkArr.forEach(function(item){
        var _link = {link: item};
        _link.type = OPTIONS.REG_CSS.test(item)?'css':'';
        console.log("type", _link)
        links.push(_link)
    });
    return links;
}

// <img src=''> | <img src=''/>
// background: url('....')
// background-image: url('....')
function getImgLink(ctnStr) {
    var links = [],
        linkArr = ctnStr && ctnStr.match(OPTIONS.REG_IMG) || [];
    linkArr.forEach(function(item, index){
        var _link = {link: item};
        links.push(_link)
    });
    return links;
}

// module link
function getModuleLink(){
    var cortexArr = [];
    var cortexJson = JSON.parse(fs.readFileSync(OPTIONS.root_dir+"/cortex.json","utf-8"))
    var dependencies = cortexJson.dependencies;
    var quoteResource = cortexJson.quoteResource || [];
    for(var i in dependencies){
        cortexArr.push("{{{modfile '" + i + "'}}}");
    }
    for(var j = 0; j < quoteResource.length; j++){

        cortexArr.push(quoteResource[j]);

    }
    return cortexArr;
}

// 获取
function getStaticFiles(dir, ctnStr){
    var _links = getLinkByMark(ctnStr),
        links = [];
    // 查找css文件中的图片 & 文字
    _links.forEach(function(item){
        links.push(item.link);
        if(item.type == 'css'){
            var link = item.link.match(/[\'\"](.*\.css)[\'\"]/);
            if(link[1]){
                // 获取css路径
                var cssPath = path.resolve(path.dirname(dir),link[1]);
                var cssStream = fs.readFileSync(cssPath, 'utf-8');
                var bgHrefRxg = /url\([\'\"]?([\w\.\/\s\-]+)[\'\"]?\)/g;
                var bgSrcRxg = /url\([\'\"]?([\w\.\/\s\-]+)[\'\"]?\)/;
                // 去个重
                var imgSrcArr = _.uniq(cssStream.match(bgHrefRxg) || []);
                var imgArr = [];
                imgSrcArr.forEach(function(item){
                    // css 文件是相对于html的, 而 img 相对于 css的
                    // 在 manifest 中, img 又是相对于html的, so......
                    imgArr.push(transformImgPath(bgSrcRxg.exec(item)[1], dir, cssPath));
                })
                links = links.concat(imgArr);
            }
        }
    });
    links = links.concat(getModuleLink() || []);
    // 去重
    return _.uniq(links);
}

function transformImgPath(imgPath, htmlPath, cssPath) {
    // 根据 css 的位置获取 img 图片的绝对位置,再获取相对html的相对位置
    var imgPath2Html = path.relative(path.dirname(htmlPath), path.resolve(path.dirname(cssPath), imgPath));
    return "{{{static '"+imgPath2Html+"'}}}";
}

function getPath(fileDir) {
    var file_paths = [];
    var newContent = "";
    // 默认只读 HTML_EXTENSION 的指定文件
    if(OPTIONS.HTML_EXTENSION && path.extname(fileDir) !== OPTIONS.HTML_EXTENSION) {
        return;
    }
    // html 入口
    fs.createReadStream(fileDir, 'utf8')
        .pipe(through2(function (chunk, enc, callback) {
            var str = chunk.toString('utf8'),
                links = getStaticFiles(fileDir, str),
                fileName = fileDir.split('/').pop(),
                cacheFileName = fileName.replace('.html', '.appcache');

            links.push(`./${fileName}?${(new Date()).getTime()}`);
            // render .appcache file
            renderCacheFile(fileDir, links);
            // 添加html manifest头
            if(/(<html)(.*)/.test(str) && str.indexOf(cacheFileName) == -1){
                // 检查是否存在 manifest
                str = str.replace(/(<html)(.*)/, `$1 manifest="${cacheFileName}" $2`)
            }
            newContent += str;
            callback()
        }, function(){
            fs.writeFile(fileDir, newContent, function(err) {
                if (err) throw err;
                console.log("add manifest done!")
            })
        }));
    return file_paths;
}
module.exports = getPath;
