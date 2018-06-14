var Q = require('q');
var rp = require('request-promise');

var videos = require('../media/videos');

const GFYCAT_JSON = 'https://gfycat.com/cajax/get/';

var upload_gfycat = function(gfycatUrl) {
    var deferred = Q.defer();

    var gfycatId = gfycatUrl.split('/').pop();

    var options = {
        uri: GFYCAT_JSON + gfycatId,
        json: true
    };
    rp.get(options).then(function(data) {
        var videoUrl = data.gfyItem.mobileUrl;

        videos.upload_from_url(videoUrl)
            .then(function(msg) {
                deferred.resolve({
                    pictureId: msg.pictureId
                });
            });
    });

    return deferred.promise;
};

module.exports = {
    upload_gfycat: upload_gfycat
};
