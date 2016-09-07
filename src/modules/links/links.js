var url = require('url');
var path = require('path');

var client = require('../../client');
var images = require('../media/images');
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

    images.upload_from_url(pictureUrl, filename).then(function(id) {
        return client.send_message(CONFIG.CLIENT_ID, null, id).then(function() {
            client.stop_typing(ev);
        });
    });
};

module.exports = {
    register: register,
    upload_image_link: upload_image_link
};
