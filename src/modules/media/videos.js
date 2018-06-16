const url = require('url');
const path = require('path');

const images = require('./images');
const cache = require('../cache/cache');
const gif = require('./gif');

const upload_from_url = async (videoUrl, start) => {
	const filename = path.basename(url.parse(videoUrl).pathname);
	const uniqueId = filename.split('.')[0];

	const response = await cache.download(videoUrl, filename);

	const videoParams = determineVideoParameters(start, response.metadata.duration);

	const gifPath = await gif.convert_mp4(response.path, uniqueId, videoParams.start, videoParams.duration);
	const id = await images.upload_from_path(gifPath, uniqueId + '.gif');

	return { pictureId: id };
};

const determineVideoParameters = (start, videoLength) => {
	if (start) {
		return {
			start: start,
			duration: videoLength
		};
	}

	if (videoLength <= 10) {
		return {
			start: 0,
			duration: videoLength
		};
	} else if (videoLength <= 15) {
		return {
			start: videoLength - 10,
			duration: 10
		};
	} else {
		return {
			start: 5,
			duration: 10
		};
	}
};

module.exports = {
	upload_from_url: upload_from_url
};
