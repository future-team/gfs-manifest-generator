var fs = require("fs");
var path =  require("path");
var filesPath = require('./FilesPath');
var renderCache = require('./Render');

/**
 * get .appcache file content
 * @param fileStream
 * @param dir
 */
function manifest(fileStream, dir){
    var filePath = fileStream.path,
        fileStr = fileStream.contents.toString(),
        fileName = path.basename(filePath),
        cacheFilePath = path.format({
            dir: dir,
            base: fileName
        }).replace('.html', '.appcache'),
        files = filesPath(fileStr, filePath, dir);

    renderCache(cacheFilePath, files);
}

module.exports = manifest;