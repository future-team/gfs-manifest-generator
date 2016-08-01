/**
 *
 * Created by dpDev on 16/7/15.
 */

"use strict";
var fs = require('fs');
var path  = require('path');
/**
 * 遍历文件目录
 * @param dir
 * @param cb
 */
function walkSync (dir, cb, ext) {
    if(!dir){
        throw new Error('the director path is not valid');
        process.exit(1);
    }
    var files = fs.readdirSync(dir);
    files.forEach(function(file) {
        var _dir = path.join(dir, file);
        if (fs.statSync(_dir).isDirectory()) {
            walkSync(_dir, cb);
        } else {
            cb.call(null, _dir)
        }
    });
}
module.exports = walkSync;