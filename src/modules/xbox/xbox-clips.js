const Xray = require('x-ray');

const videos = require('../media/videos');

const upload_xboxdvr_video = async (pageUrl) => {
	const searchForVideoQuery = new Xray()(pageUrl, 'video source@src');

	const videoUrl = await executeXray(searchForVideoQuery);
	const msg = await videos.upload_from_url(videoUrl, 18);

	return { pictureId: msg.pictureId };
};

const executeXray = (query) => {
	return new Promise((resolve, reject) => {
		query((err, results) => {
			if (err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
};

module.exports = {
	upload_xboxdvr_video: upload_xboxdvr_video
};
