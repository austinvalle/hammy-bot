var Xray = require('x-ray');
var Q = require('q');

var videos = require('../media/videos');

var upload_xboxdvr_video = function(pageUrl) {
    var deferred = Q.defer();

    var xray = new Xray();
    var filename = pageUrl.slice(-4);

    xray(pageUrl, 'video source@src')(function(err, videoUrl) {
        videos.upload_from_url(videoUrl, filename + '.mp4', filename, 28, 18).then(function(id) {
            deferred.resolve({
                pictureId: id
            });
        });
    });

    return deferred.promise;
};

module.exports = {
    upload_xboxdvr_video: upload_xboxdvr_video
};
