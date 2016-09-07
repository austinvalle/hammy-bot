var fs = require('fs');
var request = require('request');
var Q = require('q');

var client = require("../../client");
var cache = require("../shared/cache/cache");

module.exports = {
    upload_from_url: function(url, filename) {
        var deferred = Q.defer();

        cache.download(url, filename, function(path) {
            client.upload_image(path, filename).then(function(id) {
                cache.delete(filename);
                deferred.resolve(id);
            });
        });

        return deferred.promise;
    },
    upload_from_path: function(path, filename) {
        var deferred = Q.defer();

        client.upload_image(path, filename).then(function(id) {
            deferred.resolve(id);
            cache.delete(filename);
        });

        return deferred.promise;
    }
};
