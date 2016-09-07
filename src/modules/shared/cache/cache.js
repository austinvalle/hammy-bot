var Q = require('q');
var fs = require('fs');
var request = require('request');

const CACHE_PATH = 'src/modules/shared/cache/tmp/';

var download = function(uri, filename) {
    var deferred = Q.defer();

    request.head(uri, function(err, res, body) {
        var downloadPath = CACHE_PATH + filename;
        request(uri).pipe(fs.createWriteStream(CACHE_PATH + filename)).on('close', function() {
            deferred.resolve(downloadPath);
        });
    });

    return deferred.promise;
};

var deleteFile = function(filename) {
    fs.unlink(CACHE_PATH + filename);
};

module.exports = {
    PATH: CACHE_PATH,
    download: download,
    delete: deleteFile
};
