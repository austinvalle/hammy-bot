const url = require('url');
const path = require('path');

const client = require('../../client');
const cache = require('../cache/cache');

const upload_from_url = async (pictureUrl) => {
	const extension = path.basename(url.parse(pictureUrl).pathname).split('.').pop();
	const filename = Math.random().toString(36).substring(7) + '.' + extension;

	const imagePath = await cache.download(pictureUrl, filename);
	const id = await client.upload_image(imagePath, filename);

	cache.delete(filename);

	return { pictureId: id };
};

const upload_from_path = async (path) => {
	const filename = path.split('/').pop();

	const id = await client.upload_image(path, filename);

	cache.delete(filename);

	return id;
};

module.exports = {
	upload_from_url: upload_from_url,
	upload_from_path: upload_from_path
};
