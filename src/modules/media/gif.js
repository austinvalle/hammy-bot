const Q = require('q');
const giphy = require('giphy-api')();
const ffmpeg = require('fluent-ffmpeg');

const images = require('./images');
const cache = require('../cache/cache');

const convert_mp4 = (path, filename, start, duration) => {
	const deferred = Q.defer();

	const paletteName = filename + '.png';
	const gifName = filename + '.gif';

	ffmpeg(path)
		.seekInput(start)
		.inputOptions('-t ' + duration)
		.videoFilter('fps=30,scale=400:-1:flags=lanczos,palettegen=stats_mode=diff')
		.save(cache.PATH + paletteName)
		.on('end', () => {
			ffmpeg(path)
				.seekInput(start)
				.inputOptions('-t ' + duration)
				.input(cache.PATH + paletteName)
				.complexFilter('fps=30,scale=400:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=none')
				.save(cache.PATH + gifName)
				.on('end', () => {
					deferred.resolve(cache.PATH + gifName);
					cache.delete(filename + '.mp4');
					cache.delete(paletteName);
				});
		});

	return deferred.promise;
};

const random_gif = async (command) => {
	const query = command.replace('!gif ', '');

	const res = await giphy.random({tag: query, rating: 'pg-13'});
	const msg = await images.upload_from_url(res.data.image_url);

	return { pictureId: msg.pictureId };
};

module.exports = {
	convert_mp4: convert_mp4,
	random_gif: random_gif
};
