const rp = require('request-promise');

const videos = require('../media/videos');

const GFYCAT_JSON = 'https://gfycat.com/cajax/get/';

const upload_gfycat = async (gfycatUrl) => {
	const gfycatId = gfycatUrl.split('/').pop();

	const options = {
		uri: GFYCAT_JSON + gfycatId,
		json: true
	};
	const data = await rp.get(options);

	const videoUrl = data.gfyItem.mobileUrl;
	const msg = await videos.upload_from_url(videoUrl);

	return { pictureId: msg.pictureId };
};

module.exports = {
	upload_gfycat: upload_gfycat
};
