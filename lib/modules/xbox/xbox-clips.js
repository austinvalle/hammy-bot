var Xray = require('x-ray');
var Q = require('q');

var videos = require('../media/videos');

var upload_xboxdvr_video = function(pageUrl) {
    var deferred = Q.defer();

    var xray = new Xray();

    xray(pageUrl, 'video source@src')(function(err, videoUrl) {
        videos.upload_from_url(videoUrl, 18).then(function(msg) {
            deferred.resolve({
                pictureId: msg.pictureId
            });
        });
    });

    return deferred.promise;
};

module.exports = {
    upload_xboxdvr_video: upload_xboxdvr_video
};
