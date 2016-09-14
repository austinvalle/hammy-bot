var Q = require('q');
var url = require('url');
var path = require('path');

var client = require("../../client");
var cache = require("../cache/cache");

var upload_from_url = function(pictureUrl, filename) {
    var deferred = Q.defer();

    if (!filename) {
        filename = path.basename(url.parse(pictureUrl).pathname);
    }

    cache.download(pictureUrl, filename).then(function(path) {
        client.upload_image(path, filename).then(function(id) {
            deferred.resolve({
                pictureId: id
            });
            cache.delete(filename);
        });
    });

    return deferred.promise;
};

var upload_from_path = function(path, filename) {
    var deferred = Q.defer();

    client.upload_image(path, filename).then(function(id) {
        deferred.resolve(id);
        cache.delete(filename);
    });

    return deferred.promise;
};

module.exports = {
    upload_from_url: upload_from_url,
    upload_from_path: upload_from_path
};
