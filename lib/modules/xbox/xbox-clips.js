var Xray = require('x-ray');

var client = require('../../client');
var videos = require('../media/videos');
var CONFIG = require('../../config');

const XBOXDVR_REGEX = /(https?:\/\/xboxdvr\.com\/gamer\/\w+\/video\/\d+)/g;

var register = function() {
    client.chat.on('message', function(ev, msg) {
        var matches = msg.match(XBOXDVR_REGEX);

        if (matches) {
            client.start_typing(ev);

            upload_xboxdvr_video(matches[0]);
        }
    });
};

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
    register: register,
    upload_xboxdvr_video: upload_xboxdvr_video
};
