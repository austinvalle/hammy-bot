var fs = require('fs');
var request = require('request');

const CACHE_PATH = 'src/modules/shared/cache/tmp/';

module.exports = {
    PATH: CACHE_PATH,
    download: function(uri, filename, callback) {
        request.head(uri, function(err, res, body) {
            var downloadPath = CACHE_PATH + filename;
            request(uri).pipe(fs.createWriteStream(CACHE_PATH + filename)).on('close', function() {
                callback(downloadPath);
            });
        });
    },
    delete: function(filename) {
        fs.unlink(CACHE_PATH + filename);
    }
};
