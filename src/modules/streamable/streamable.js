const rp = require('request-promise');

const MessageBuilder = require('../../client').MessageBuilder;
const videos = require('../media/videos');

const STREAMABLE_JSON = 'https://api.streamable.com/videos/';

const upload_streamable = async (streamableUrl) => {
	const streamableId = streamableUrl.split('/').pop();

	const options = {
		uri: STREAMABLE_JSON + streamableId,
		json: true
	};

	const data = await rp.get(options);

	let file = data.files['mp4'];
	if (data.files['mp4-mobile']) {
		file = data.files['mp4-mobile'];
	}

	const videoUrl = 'https:' + file.url;

	const builder = new MessageBuilder();
	let segments;
	if (data.title) {
		segments = builder.bold(data.title).toSegments();
	}

	const msg = await videos.upload_from_url(videoUrl);

	return { segments: segments, pictureId: msg.pictureId };
};

module.exports = {
	upload_streamable: upload_streamable
};
