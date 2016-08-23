var fs = require('fs');
var request = require('request');
var Q = require('q');

var client = require("../../client");

const CACHE_PATH = 'src/modules/images/cache/';

module.exports = {
    upload_from_url: function(url, filename) {
        var deferred = Q.defer();

        download_to_cache(url, filename, function() {
            return client.upload_image(CACHE_PATH + filename, filename).then(function(id) {
                delete_from_cache(filename);
                deferred.resolve(id);
            });
        });

        return deferred.promise;
    }
};

var download_to_cache = function(uri, filename, callback) {
    request.head(uri, function(err, res, body) {
        request(uri).pipe(fs.createWriteStream(CACHE_PATH + filename)).on('close', callback);
    });
};

var delete_from_cache = function(filename) {
    fs.unlink(CACHE_PATH + filename);
};
