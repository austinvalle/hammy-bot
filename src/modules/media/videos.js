var Q = require('q');

var images = require('./images');
var cache = require('../cache/cache');
var gif = require('./gif');

var upload_from_url = function(url, filename, uniqueId, videoLength) {
    var deferred = Q.defer();

    var videoParams = determineVideoParameters(videoLength);

    cache.download(url, filename).then(function(downloadPath) {
        gif.convert_mp4(downloadPath, uniqueId, videoParams.start, videoParams.duration).then(function(gifPath) {
            images.upload_from_path(gifPath, uniqueId + '.gif')
                .then(function(id) {
                    deferred.resolve(id);
                });
        });
    });

    return deferred.promise;
};

var determineVideoParameters = function(videoLength) {
    if (videoLength <= 10) {
        return {
            start: 0,
            duration: videoLength
        }
    } else if (videoLength <= 15) {
        return {
            start: videoLength - 10,
            duration: 10
        }
    } else {
        return {
            start: 5,
            duration: 10
        }
    }
};

module.exports = {
    upload_from_url: upload_from_url
};
