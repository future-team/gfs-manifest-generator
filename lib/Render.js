var fs = require('fs');

/**
 *
 * @param filePath
 * @param links
 */
function render(filePath, links) {
    var cacheFiles = links.join('\n'),
        templ = `CACHE MANIFEST
# origin manifest file
# create at ${new Date()}
CACHE:
${cacheFiles}
NETWORK:
*`;
    fs.writeFile(filePath, templ, (err) => {
        if (err) throw err;
        console.log('appcache file saved!')
    });
}
module.exports = render;