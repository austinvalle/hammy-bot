var Twit = require('twit');
var url = require('url');
var path = require('path');

var client = require('../../client');
var images = require('../images/images');
var CONFIG = require('../../config');

const STATUS_REGEX = /(https?:\/\/twitter\.com\/.+?\/status\/\d+)/g;

module.exports = {
    register: function() {
        var twitter_client = new Twit({
            consumer_key: CONFIG.TWITTER.CONSUMER_KEY,
            consumer_secret: CONFIG.TWITTER.CONSUMER_SECRET,
            access_token: CONFIG.TWITTER.ACCESS_TOKEN,
            access_token_secret: CONFIG.TWITTER.ACCESS_TOKEN_SECRET
        });

        client.chat.on('message', function(ev, msg) {
            var matches = msg.match(STATUS_REGEX);

            if (matches) {
                client.start_typing(ev);

                for (var i = 0; i < matches.length; i++) {
                    var status = getStatusId(matches[i]);

                    twitter_client.get('statuses/show', {
                        id: status.id
                    }, function(err, data, response) {
                        var builder = new client.MessageBuilder();
                        var segments = builder.italic('"' + data.text + '"').text(' - ').bold('@' + data.user.screen_name).toSegments();

                        if (data.entities.media) {
                            var pictureUrl = data.entities.media[0].media_url;
                            var filename = path.basename(url.parse(pictureUrl).pathname);

                            images.upload_from_url(pictureUrl, filename).then(function(id) {
                                return client.send_message(CONFIG.CLIENT_ID, segments, id).then(function() {
                                    client.stop_typing(ev);
                                });
                            });
                        } else {
                            return client.send_message(CONFIG.CLIENT_ID, segments).then(function() {
                                client.stop_typing(ev);
                            });
                        }
                    });
                }
            }
        });
    }
}

const statusIdRegex = /\/status(es)?\/(\d+)/;

var getStatusId = function(uri) {
    var parsed = url.parse(uri);

    if (parsed.host !== 'twitter.com') {
        return null;
    }

    if (parsed.path.indexOf('status') === -1) {
        return null;
    }

    var match = statusIdRegex.exec(parsed.path);
    if (match === null) {
        return null;
    }

    return {
        id: match[2]
    };
}
