const Xray = require('x-ray');
const Q = require('q');

const videos = require('../media/videos');

const upload_xboxdvr_video = (pageUrl) => {
	const deferred = Q.defer();

	const xray = new Xray();

	xray(pageUrl, 'video source@src')((err, videoUrl) => {
		videos.upload_from_url(videoUrl, 18).then((msg) => {
			deferred.resolve({
				pictureId: msg.pictureId
			});
		});
	});

	return deferred.promise;
};

module.exports = {
	upload_xboxdvr_video: upload_xboxdvr_video
};
