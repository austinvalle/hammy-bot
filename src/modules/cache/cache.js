const Q = require('q');
const fs = require('fs');
const request = require('request');
const ffmpeg = require('fluent-ffmpeg');

const CACHE_PATH = 'src/modules/cache/tmp/';

const download = (uri, filename) => {
	const deferred = Q.defer();

	request.head(uri, () => {
		filename = filename.toLowerCase();
		const downloadPath = CACHE_PATH + filename;
		request.get(uri).pipe(fs.createWriteStream(downloadPath)).on('close', () => {
			if (filename.split('.').pop() == 'mp4') {
				get_video_metadata(downloadPath).then((metadata) => {
					deferred.resolve({
						path: downloadPath,
						metadata: metadata
					});
				});
			}
			else {
				deferred.resolve(downloadPath);
			}
		});
	});

	return deferred.promise;
};

const get_video_metadata = (path) => {
	const deferred = Q.defer();

	ffmpeg.ffprobe(path, (err, metadata) => {
		deferred.resolve(metadata.format);
	});

	return deferred.promise;
};

const deleteFile = (filename) => {
	fs.unlink(CACHE_PATH + filename, () => {});
};

module.exports = {
	PATH: CACHE_PATH,
	download: download,
	delete: deleteFile
};
