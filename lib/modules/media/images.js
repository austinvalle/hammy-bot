var Q = require('q');
var url = require('url');
var path = require('path');

var client = require("../../client");
var cache = require("../cache/cache");
var CONFIG = require('../../config');

const URL_REGEX = /(https?:[/|.|\w|-]*\.(?:jpg|jpeg|gif|png))/g;

var register = function() {
    client.chat.on('message', function(ev, msg) {
        var matches = msg.match(URL_REGEX);

        if (matches) {
            client.start_typing(ev);

            for (var i = 0; i < matches.length; i++) {
                upload_image_link(matches[i]);
            }
        }
    });
};

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
    register: register,
    upload_from_url: upload_from_url,
    upload_from_path: upload_from_path
};
