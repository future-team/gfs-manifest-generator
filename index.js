/**
 * Created by dpDev on 16/7/12.
 */
var _ = require('lodash');
var fw = require('./src/file_walk');
var fp = require('./src/file_path');

var defaultConf = {
    REG_IMG: /<img\s+src\=[\'\"]\{{3}(static|modfile)\s+[\'\"]([\w\.\/\'\"\s\-]+)[\'\"]\s*\}{3}[\'\"]\s*\/>/g,
    REG_CSS: /\.css/i,
    REG_JS: /\.js/i,
    REG_FONT: /[\.woff]/i,
    REG_BG: /\((.*?)\)/,
    REG_MARK: /\{{3}[^facade](.*)\}{3}/gi,
    HTML_EXTENSION: '.html',
};

module.exports = function(opts){
    if(!opts || !_.isObject(opts)){
        throw new Error('options not valid');
        process.exit(1)
    }

    if(!opts.root_dir || !opts.html_dir || !opts.css_dir) {
        throw new Error('root, html, css path must need');
        process.exit(1)
    }
    GLOBAL.OPTIONS = _.extend(defaultConf, opts);
    fw(opts.html_dir, fp);
};