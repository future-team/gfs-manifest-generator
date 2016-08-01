/**
 * Created by dpDev on 16/7/14.
 */
var fs = require('fs')
function render(file, staticFiles) {
    var cacheFiles = staticFiles.join('\n'),
        tmpl = `CACHE MANIFEST
# origin manifest file
# create at ${new Date()}
CACHE:
${cacheFiles}
NETWORK:
*`, cacheFile = file.replace('.html', '.appcache');
    fs.writeFile(cacheFile, tmpl, (err) => {
        if (err) throw err
        console.log('It\'s saved!')
    });
}
module.exports = render