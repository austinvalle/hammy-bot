var Q = require('q');
var url = require('url');
var path = require('path');

var images = require('./images');
var cache = require('../cache/cache');
var gif = require('./gif');

var upload_from_url = function(videoUrl, filename, uniqueId, start) {
    var deferred = Q.defer();

    if (!filename) {
        filename = path.basename(url.parse(videoUrl).pathname);
    }

    if (!uniqueId) {
        uniqueId = filename.split('.')[0];
    }

    cache.download(videoUrl, filename).then(function(response) {
        var videoParams = determineVideoParameters(start, response.metadata.duration);

        gif.convert_mp4(response.path, uniqueId, videoParams.start, videoParams.duration).then(function(gifPath) {
            images.upload_from_path(gifPath, uniqueId + '.gif')
                .then(function(id) {
                    deferred.resolve({
                        pictureId: id
                    });
                });
        });
    });

    return deferred.promise;
};

var determineVideoParameters = function(start, videoLength) {
    if (start) {
        return {
            start: start,
            duration: videoLength
        }
    }

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
