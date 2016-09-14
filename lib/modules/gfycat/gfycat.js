var Q = require('q');
var rp = require('request-promise');

var images = require('../media/images');

const GFYCAT_JSON = 'https://gfycat.com/cajax/get/';

var upload_gfycat = function(gfycatUrl) {
    var deferred = Q.defer();

    var gfycatId = gfycatUrl.split('/').pop();

    var options = {
        uri: GFYCAT_JSON + gfycatId,
        json: true
    };
    rp.get(options).then(function(data) {
        var filename = data.gfyItem.gifUrl.split('/').pop();
        var pictureUrl = data.gfyItem.gifUrl;

        images.upload_from_url(pictureUrl, filename)
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