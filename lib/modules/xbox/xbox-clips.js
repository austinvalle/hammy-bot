var Xray = require('x-ray');

var client = require('../../client');
var videos = require('../media/videos');
var CONFIG = require('../../config/config');

var upload_xboxdvr_video = function(pageUrl) {
    var xray = new Xray();
    var filename = pageUrl.slice(-4);

    xray(pageUrl, 'video source@src')(function(err, videoUrl) {
        videos.upload_from_url(videoUrl, filename + '.mp4', filename, 28, 18).then(function(id) {
            return client.send_message(CONFIG.CLIENT_ID, null, id);
        });
    });
};

module.exports = {
    upload_xboxdvr_video: upload_xboxdvr_video
};
