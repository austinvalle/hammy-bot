var rp = require('request-promise');

var client = require('../../client');
var images = require('../media/images');
var CONFIG = require('../../config/config');

const GFYCAT_JSON = 'https://gfycat.com/cajax/get/';

var upload_gfycat = function(gfycatUrl) {
    var gfycatId = gfycatUrl.split('/').pop();

    var options = {
        uri: GFYCAT_JSON + gfycatId,
        json: true
    };
    rp(options).then(function(data) {
        var filename = data.gfyItem.gifUrl.split('/').pop();
        var pictureUrl = data.gfyItem.gifUrl;

        images.upload_from_url(pictureUrl, filename)
            .then(function(id) {
                return client.send_message(CONFIG.CLIENT_ID, null, id)
                    .then(function() {
                        client.stop_typing(ev);
                    });
            });
    });
};

module.exports = {
    upload_gfycat: upload_gfycat
};
