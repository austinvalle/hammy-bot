var Q = require('q');
var fs = require('fs');
var request = require('request');
var ffmpeg = require('fluent-ffmpeg');

const CACHE_PATH = 'lib/modules/cache/tmp/';

var download = function(uri, filename) {
    var deferred = Q.defer();

    request.head(uri, function(err, res, body) {
        var downloadPath = CACHE_PATH + filename;

        request.get(uri).pipe(fs.createWriteStream(downloadPath)).on('close', function() {
            if (filename.split('.').pop() == 'mp4') {
                get_video_metadata(downloadPath).then(function(metadata) {

                    deferred.resolve({
                        path: downloadPath,
                        metadata: metadata
                    });
                });
            } else {
                deferred.resolve(downloadPath);
            }
        });
    });

    return deferred.promise;
};

var get_video_metadata = function(path) {
    var deferred = Q.defer();

    ffmpeg.ffprobe(path, function(err, metadata) {
        deferred.resolve(metadata.format);
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
