const gfycat = require('./gfycat/gfycat');
const images = require('./media/images');
const gif = require('./media/gif');
const videos = require('./media/videos');
const streamable = require('./streamable/streamable');
const twitter = require('./twitter/twitter');
const xboxclips = require('./xbox/xbox-clips');

const message_events = [{
	regex: /(https?:\/\/gfycat\.com\/\w+)/g,
	callback: gfycat.upload_gfycat,
	allow_multiple: true
}, {
	regex: /^!gif (.*)$/g,
	callback: gif.random_gif,
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
