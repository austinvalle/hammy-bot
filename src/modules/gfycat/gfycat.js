var client = require('../../client');
var images = require('../images/images');
var CONFIG = require('../../config');

const GFYCAT_REGEX = /(https?:\/\/gfycat\.com\/\w+)/g;
const BIG_GFYCAT = 'https://giant.gfycat.com/';

module.exports = {
    register: function() {

        client.chat.on('message', function(ev, msg) {
            var matches = msg.match(GFYCAT_REGEX);

            if (matches) {
                client.start_typing(ev);
                for (var i = 0; i < matches.length; i++) {
                    var filename = matches[i].split('/').pop() + '.gif';
                    var pictureUrl = BIG_GFYCAT + filename;

                    images.upload_from_url(pictureUrl, filename).then(function(id) {
                        return client.send_message(CONFIG.CLIENT_ID, null, id).then(function() {
                            client.stop_typing(ev);
                        });
                    });
                }
            }
        });
    }
}
