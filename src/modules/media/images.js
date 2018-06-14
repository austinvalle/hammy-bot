var Q = require('q');
var url = require('url');
var path = require('path');

var client = require("../../client");
var cache = require("../cache/cache");

var upload_from_url = function(pictureUrl) {
    var deferred = Q.defer();

    var extension = path.basename(url.parse(pictureUrl).pathname).split('.').pop();
    var filename = Math.random().toString(36).substring(7) + "." + extension;

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

var upload_from_path = function(path) {
    var deferred = Q.defer();

    var filename = path.split('/').pop();

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
