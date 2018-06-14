const Q = require('q');
const giphy = require('giphy-api')();
const images = require('../media/images');

const random_giphy = (command) => {
	const deferred = Q.defer();

	const query = command.replace('!gif ', '');

	giphy.random({tag: query, rating: 'pg-13'}).then((res) => {
		images.upload_from_url(res.data.image_url).then((msg) => {
			deferred.resolve({
				pictureId: msg.pictureId
			});
		});
	});

	return deferred.promise;
};

module.exports = {
	random_giphy: random_giphy
};
