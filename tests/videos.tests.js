const sinon = require('sinon');
const expect = require('chai').expect;

const Q = require('q');

const cache = require('../src/modules/cache/cache');
const images = require('../src/modules/media/images');
const gif = require('../src/modules/media/gif');
const videos = require('../src/modules/media/videos');

describe('videos module', () => {
	describe('upload from url', () => {
		let cacheDeferred,
			gifDeferred,
			uploadDeferred,
			fakePath;

		beforeEach(() => {
			fakePath = 'fake/path/to/file';
			cacheDeferred = Q.defer();
			gifDeferred = Q.defer();
			uploadDeferred = Q.defer();

			sinon.stub(cache, 'download').callsFake(() => {
				return cacheDeferred.promise;
			});
			sinon.stub(gif, 'convert_mp4').callsFake(() => {
				return gifDeferred.promise;
			});
			sinon.stub(images, 'upload_from_path').callsFake(() => {
				return uploadDeferred.promise;
			});

			gifDeferred.resolve(fakePath + '.gif');
			uploadDeferred.resolve(1234);
		});

		afterEach(() => {
			cache.download.restore();
			gif.convert_mp4.restore();
			images.upload_from_path.restore();
		});

		it('w/ start param: should download, convert, and upload gif', (done) => {
			const videoUrl = 'http://fakeurl/fakevideo.mp4';
			const start = 25;

			cacheDeferred.resolve({
				path: fakePath,
				metadata: {
					duration: 30
				}
			});

			videos.upload_from_url(videoUrl, start).then((msg) => {
				try {
					expect(msg.pictureId).to.equal(1234);
					sinon.assert.calledOnce(cache.download);
					sinon.assert.calledWith(cache.download, videoUrl, 'fakevideo.mp4');

					sinon.assert.calledOnce(gif.convert_mp4);
					sinon.assert.calledWith(gif.convert_mp4, fakePath, 'fakevideo', start, 30);

					sinon.assert.calledOnce(images.upload_from_path);
					sinon.assert.calledWith(images.upload_from_path, fakePath + '.gif');
					done();
				} catch (err) {
					done(err);
				}
			});
		});

		it('duration <= 10: should download, convert, and upload gif', (done) => {
			const videoUrl = 'http://fakeurl/fakevideo.mp4';

			cacheDeferred.resolve({
				path: fakePath,
				metadata: {
					duration: 9
				}
			});

			videos.upload_from_url(videoUrl).then((msg) => {
				try {
					expect(msg.pictureId).to.equal(1234);
					sinon.assert.calledOnce(cache.download);
					sinon.assert.calledWith(cache.download, videoUrl, 'fakevideo.mp4');

					sinon.assert.calledOnce(gif.convert_mp4);
					sinon.assert.calledWith(gif.convert_mp4, fakePath, 'fakevideo', 0, 9);

					sinon.assert.calledOnce(images.upload_from_path);
					sinon.assert.calledWith(images.upload_from_path, fakePath + '.gif');
					done();
				} catch (err) {
					done(err);
				}
			});
		});

		it('duration <= 15: should download, convert, and upload gif', (done) => {
			const videoUrl = 'http://fakeurl/fakevideo.mp4';

			cacheDeferred.resolve({
				path: fakePath,
				metadata: {
					duration: 13
				}
			});

			videos.upload_from_url(videoUrl).then((msg) => {
				try {
					expect(msg.pictureId).to.equal(1234);
					sinon.assert.calledOnce(cache.download);
					sinon.assert.calledWith(cache.download, videoUrl, 'fakevideo.mp4');

					sinon.assert.calledOnce(gif.convert_mp4);
					sinon.assert.calledWith(gif.convert_mp4, fakePath, 'fakevideo', 3, 10);

					sinon.assert.calledOnce(images.upload_from_path);
					sinon.assert.calledWith(images.upload_from_path, fakePath + '.gif');
					done();
				} catch (err) {
					done(err);
				}
			});
		});

		it('duration > 15: should download, convert, and upload gif', (done) => {
			const videoUrl = 'http://fakeurl/fakevideo.mp4';

			cacheDeferred.resolve({
				path: fakePath,
				metadata: {
					duration: 25
				}
			});

			videos.upload_from_url(videoUrl).then((msg) => {
				try {
					expect(msg.pictureId).to.equal(1234);
					sinon.assert.calledOnce(cache.download);
					sinon.assert.calledWith(cache.download, videoUrl, 'fakevideo.mp4');

					sinon.assert.calledOnce(gif.convert_mp4);
					sinon.assert.calledWith(gif.convert_mp4, fakePath, 'fakevideo', 5, 10);

					sinon.assert.calledOnce(images.upload_from_path);
					sinon.assert.calledWith(images.upload_from_path, fakePath + '.gif');
					done();
				} catch (err) {
					done(err);
				}
			});
		});
	});
});
