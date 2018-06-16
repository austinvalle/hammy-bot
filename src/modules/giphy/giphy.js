const giphy = require('giphy-api')();
const images = require('../media/images');

const random_giphy = async (command) => {
	const query = command.replace('!gif ', '');

	const res = await giphy.random({tag: query, rating: 'pg-13'});
	const msg = await images.upload_from_url(res.data.image_url);

	return { pictureId: msg.pictureId };
};

module.exports = {
	random_giphy: random_giphy
};
