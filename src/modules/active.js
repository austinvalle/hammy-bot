var gfycat = require('./gfycat/gfycat');
var giphy = require('./giphy/giphy');
var images = require('./media/images');
var videos = require('./media/videos');
var streamable = require('./streamable/streamable');
var twitter = require('./twitter/twitter');
var xboxclips = require('./xbox/xbox-clips');

var message_events = [{
    regex: /(https?:\/\/gfycat\.com\/\w+)/g,
    callback: gfycat.upload_gfycat,
    allow_multiple: true
}, {
    regex: /^!gif (.*)$/g,
    callback: giphy.random_giphy,
    allow_multiple: false
}, {
    regex: /(https?:[/|.|\w|-]*\.(?:jpg|jpeg|gif|png))/g,
    callback: images.upload_from_url,
    allow_multiple: true
}, {
    regex: /(https?:[/|.|\w|-]*\.(?:mp4))/g,
    callback: videos.upload_from_url,
    allow_multiple: true
}, {
    regex: /(https?:\/\/streamable\.com\/\w+)/g,
    callback: streamable.upload_streamable,
    allow_multiple: true
}, {
    regex: /(https?:\/\/twitter\.com\/.+?\/status\/\d+)/g,
    callback: twitter.upload_twitter_status,
    allow_multiple: true
}, {
    regex: /(https?:\/\/xboxdvr\.com\/gamer\/\w+\/video\/\d+)/g,
    callback: xboxclips.upload_xboxdvr_video,
    allow_multiple: false
}];

module.exports = {
    message_events: message_events
};
