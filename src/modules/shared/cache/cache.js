var fs = require('fs');
var request = require('request');

const CACHE_PATH = 'src/modules/shared/cache/tmp/';

var download = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        var downloadPath = CACHE_PATH + filename;
        request(uri).pipe(fs.createWriteStream(CACHE_PATH + filename)).on('close', function() {
            callback(downloadPath);
        });
    });
};

var deleteFile = function(filename) {
    fs.unlink(CACHE_PATH + filename);
};

module.exports = {
    PATH: CACHE_PATH,
    download: download,
    delete: deleteFile
};
