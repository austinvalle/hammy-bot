var Twit = require('twit');
var url = require('url');
var path = require('path');
var Q = require('q');

var client = require('../../client');
var images = require('../media/images');
var videos = require('../media/videos');
var CONFIG = require('../../config/config');

var twitter_client = new Twit({
    consumer_key: CONFIG.TWITTER.CONSUMER_KEY,
    consumer_secret: CONFIG.TWITTER.CONSUMER_SECRET,
    access_token: CONFIG.TWITTER.ACCESS_TOKEN,
    access_token_secret: CONFIG.TWITTER.ACCESS_TOKEN_SECRET
});

const statusIdRegex = /\/status(es)?\/(\d+)/;

var upload_twitter_status = function(twitterUrl) {
    var deferred = Q.defer();

    var status = getStatusId(twitterUrl);

    twitter_client.get('statuses/show', {
        id: status.id
    }, function(err, data, response) {
        var segments = build_tweet_text(data);

        if (data.extended_entities) {
            var media = data.extended_entities.media[0];

            if (media.type == 'photo') {
                handle_photo_tweet(media.media_url, segments, deferred);
            } else if (media.type == 'animated_gif') {
                handle_gif_tweet(media.video_info.variants[0].url, segments, deferred);
            }
        } else {
            handle_text_tweet(segments, deferred);
        }
    });

    return deferred.promise;
};

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
};

var build_tweet_text = function(data) {
    var builder = new client.MessageBuilder();
    var segments = builder.italic('"' + data.text + '"').text(' - ').bold('@' + data.user.screen_name).toSegments();

    return segments;
};

var handle_photo_tweet = function(photoUrl, segments, deferred) {
    var filename = path.basename(url.parse(photoUrl).pathname);

    images.upload_from_url(photoUrl, filename).then(function(id) {
        return client.send_message(CONFIG.CLIENT_ID, segments, id).then(function() {
            deferred.resolve();
        });
    });
};

var handle_gif_tweet = function(gifUrl, segments, deferred) {
    var filename = path.basename(url.parse(gifUrl).pathname);
    var uniqueId = filename.substr(0, filename.lastIndexOf('.'));

    videos.upload_from_url(gifUrl, filename, uniqueId, 10).then(function(id) {
        return client.send_message(CONFIG.CLIENT_ID, segments, id).then(function() {
            deferred.resolve();
        });
    });
};

var handle_text_tweet = function(segments, deferred) {
    return client.send_message(CONFIG.CLIENT_ID, segments).then(function() {
        deferred.resolve();
    });
};

module.exports = {
    upload_twitter_status: upload_twitter_status
};
