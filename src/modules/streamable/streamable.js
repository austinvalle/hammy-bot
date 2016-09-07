var rp = require('request-promise');

var client = require('../../client');
var videos = require('../videos/videos');
var CONFIG = require('../../config');

const STREAMABLE_REGEX = /(https?:\/\/streamable\.com\/\w+)/g;
const STREAMABLE_JSON = 'https://api.streamable.com/videos/';

var register = function() {
    client.chat.on('message', function(ev, msg) {
        var matches = msg.match(STREAMABLE_REGEX);

        if (matches) {
            client.start_typing(ev);
            for (var i = 0; i < matches.length; i++) {
                upload_streamable(matches[i].split('/').pop());
            }
        }
    });
}

var upload_streamable = function(streamableId) {
    var options = {
        uri: STREAMABLE_JSON + streamableId,
        json: true
    };

    rp(options).then(function(data) {
        var file = data.files["mp4"];
        if (data.files["mp4-mobile"]) {
            file = data.files["mp4-mobile"];
        }

        var filename = file.url.split('/').pop();
        var videoUrl = 'https:' + file.url;

        var builder = new client.MessageBuilder();
        var segments;
        if (data.title) {
            segments = builder.bold(data.title).toSegments();
        }

        videos.upload_from_url(videoUrl, filename, streamableId, file.duration).then(function(id) {
            return client.send_message(CONFIG.CLIENT_ID, segments, id)
                .then(function() {
                    client.stop_typing(ev);
                });
        });
    });
}

module.exports = {
    register: register,
    upload_streamable: upload_streamable
}
