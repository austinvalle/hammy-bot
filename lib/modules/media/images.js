var Q = require('q');
var url = require('url');
var path = require('path');

var client = require("../../client");
var cache = require("../cache/cache");
var CONFIG = require('../../config/config');

var upload_image_link = function(pictureUrl) {
    var filename = path.basename(url.parse(pictureUrl).pathname);

    upload_from_url(pictureUrl, filename).then(function(id) {
        return client.send_message(CONFIG.CLIENT_ID, null, id).then(function() {
            client.stop_typing(ev);
        });
    });
};

var upload_from_url = function(url, filename) {
    var deferred = Q.defer();

    cache.download(url, filename).then(function(path) {
        client.upload_image(path, filename).then(function(id) {
            deferred.resolve(id);
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
    upload_image_link: upload_image_link,
    upload_from_url: upload_from_url,
    upload_from_path: upload_from_path
};
