const Q = require('q');
const url = require('url');
const path = require('path');

const client = require('../../client');
const cache = require('../cache/cache');

const upload_from_url = (pictureUrl) => {
	const deferred = Q.defer();

	const extension = path.basename(url.parse(pictureUrl).pathname).split('.').pop();
	const filename = Math.random().toString(36).substring(7) + '.' + extension;

	cache.download(pictureUrl, filename).then((path) => {
		client.upload_image(path, filename).then((id) => {
			deferred.resolve({
				pictureId: id
			});
			cache.delete(filename);
		});
	});

	return deferred.promise;
};

const upload_from_path = (path) => {
	const deferred = Q.defer();

	const filename = path.split('/').pop();

	client.upload_image(path, filename).then((id) => {
		deferred.resolve(id);
		cache.delete(filename);
	});

	return deferred.promise;
};

module.exports = {
	upload_from_url: upload_from_url,
	upload_from_path: upload_from_path
};
