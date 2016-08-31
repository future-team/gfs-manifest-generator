/**
 * 根据 html 文件分析出与该页面相关的所有静态文件
 * css 文件 注: 分析预处理之后的文件
 * js 文件 注: 依赖文件,一般都有专门的配置文件
 * 图片 注: html文件的引用 、css文件中的引用
 * Created by genffy on 16/8/29.
 */
"use strict";
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var REG_CONF = {
    REG_SRC: /src\=[\"\'](([a-zA-z]+:\/|\.)\/[^\s]*)[\"\']/gi,
    REG_URL: /url\([\'\"]?(([a-zA-z]+:\/|\.)\/[^\s]*)[\'\"]?\)/gi,
    REG_HREF: /href\=[\"\'](([a-zA-z]+:\/|\.)\/[^\s]*)[\"\']/gi,
    REG_EXTRA: /^((src\=|href\=|url\()[\"\']?)|([\"\']?\)?$)/gi,
    REG_URI: /(http|https):\/\/[^\s]*/
};

/**
 * get static file url from html file and add file type
 * @param fileStr
 * @returns {Array}
 */
function getLinkByMark(fileStr){
    var links = [],
        hrefArr = fileStr.match(REG_CONF.REG_HREF),
        srcArr = fileStr.match(REG_CONF.REG_SRC),
        urlArr = fileStr.match(REG_CONF.REG_URL),
        linkArr = _.concat((hrefArr||[]), (srcArr||[]), (urlArr||[]));
    _.forEach(linkArr, function(item){
        if(item){
            var _url = item.replace(REG_CONF.REG_EXTRA,'');
            var _link = {link: _url};
            _link.type = _.lowerCase(_url.match(/\.(css|js|png|jpg|gif)+/gi));
            links.push(_link)
        }
    });
    return links;
}

/**
 * 
 * @param fileStr
 * @param filePath
 * @param dir
 * @returns {Array}
 */
function getStaticFiles(fileStr, filePath, dir){
    var _links = getLinkByMark(fileStr),
        links = [];
    // deal url in css file
    _links.forEach(function(item){
        links.push(item.link);
        if(item.type == 'css' && !REG_CONF.REG_URI.test(item.link)){
            var cssPath = path.resolve(dir, item.link);
            try{
                var cssStream = fs.readFileSync(cssPath, 'utf-8');
                var bgArr = _.uniq(cssStream.match(REG_CONF.REG_URL) || []);
                var imgArr = [];
                bgArr.forEach(function(item){
                    var _url = item.replace(REG_CONF.REG_EXTRA,'');
                    imgArr.push(_url);
                });
                links = links.concat(imgArr);
            }catch (err){
                if(err.code === 'ENOENT'){
                    console.log('File not found!');
                }else{
                    console.log('some thing error', err);
                }
            }
        }
    });
    return _.uniq(links);
}

/**
 * 
 * @param imgPath
 * @param htmlPath
 * @param cssPath
 * @returns {*|{>,  , +, ~}}
 */
function transformImgPath(imgPath, htmlPath, cssPath) {
    // 根据 css 的位置获取 img 图片的绝对位置,再获取相对html的相对位置
    var imgPath2Html = path.relative(path.dirname(htmlPath), path.resolve(path.dirname(cssPath), imgPath));
    return imgPath2Html;
}

/**
 * 
 * @param fileStr
 * @param filePath
 * @param dir
 */
function getPath(fileStr, filePath, dir) {
    var links = getStaticFiles(fileStr, filePath, dir),
        fileName = path.basename(filePath);
    links.push(`./${fileName}?${(new Date()).getTime()}`);
    return links;
}
module.exports = getPath;
