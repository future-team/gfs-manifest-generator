var through = require('through2');
var path = require('path');
var manifest = require('./Manifest');
var _ = require('lodash');
/**
 *
 * @param options
 * @returns {*}
 */
function genManifest(options) {
    if(!options || !_.isObject(options)){
        throw new Error('options not valid');
        process.exit(1);
    }

    if(!options.dir) {
        throw new Error('dir params must need');
        process.exit(1);
    }
    var dir  = options.dir;
    return through.obj(function(file, enc, cb) {
        var _path = file.path;
        // TODO should be config it.
        if(path.extname(_path) == '.html'){
            manifest(file, dir);
            // add manifest attribute to .html file
            var _fileStr = file.contents.toString();
            var cacheFileName = path.basename(_path).replace('.html', '.appcache');
            if(/(<html)(.*)/.test(_fileStr) && _fileStr.indexOf(cacheFileName) == -1){
                // 检查是否存在 manifest
                _fileStr = _fileStr.replace(/(<html)(.*)/, `$1 manifest="${cacheFileName}" $2`)
            }
            file.contents = new Buffer(_fileStr);
        }
        // keep origin out put
        this.push(file);
        return cb();
    });
}

module.exports = genManifest;