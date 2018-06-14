const Q = require('q');
const rp = require('request-promise');

const videos = require('../media/videos');

const GFYCAT_JSON = 'https://gfycat.com/cajax/get/';

const upload_gfycat = (gfycatUrl) => {
	const deferred = Q.defer();

	const gfycatId = gfycatUrl.split('/').pop();

	const options = {
		uri: GFYCAT_JSON + gfycatId,
		json: true
	};
	rp.get(options).then((data) => {
		const videoUrl = data.gfyItem.mobileUrl;

		videos.upload_from_url(videoUrl)
			.then((msg) => {
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
