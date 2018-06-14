const sinon = require('sinon');
const expect = require('chai').expect;

const Q = require('q');

const client = require('../src/client');
const cache = require('../src/modules/cache/cache');
const images = require('../src/modules/media/images');

describe('images module', () => {
	describe('upload image from url', () => {
		let cacheDeferred,
			uploadDeferred,
			fakePath;

		beforeEach(() => {
			fakePath = 'fake/path/to/file';
			cacheDeferred = Q.defer();
			uploadDeferred = Q.defer();

			sinon.stub(cache, 'download').callsFake(() => {
				return cacheDeferred.promise;
			});

			sinon.stub(client, 'upload_image').callsFake(() => {
				return uploadDeferred.promise;
			});

			sinon.stub(cache, 'delete');

			cacheDeferred.resolve(fakePath);
			uploadDeferred.resolve(1234);
		});

		afterEach(() => {
			cache.download.restore();
			client.upload_image.restore();
			cache.delete.restore();
		});

		it('w/o filename: should download to cache, upload to client, then delete', (done) => {
			const pictureUrl = 'http://fakeurl/fakeimage123.jpg';

			images.upload_from_url(pictureUrl).then((msg) => {
				try {
					expect(msg.pictureId).to.equal(1234);
					sinon.assert.calledOnce(cache.download);
					sinon.assert.calledWith(cache.download, pictureUrl, sinon.match.any);

					sinon.assert.calledOnce(client.upload_image);
					sinon.assert.calledWith(client.upload_image, fakePath, sinon.match.any);

					sinon.assert.calledOnce(cache.delete);
					sinon.assert.calledWith(cache.delete, sinon.match.any);
					done();
				} catch (err) {
					done(err);
				}
			});
		});
	});

	describe('upload image from path', () => {
		let uploadDeferred;

		beforeEach(() => {
			uploadDeferred = Q.defer();

			sinon.stub(client, 'upload_image').callsFake(() => {
				return uploadDeferred.promise;
			});

			sinon.stub(cache, 'delete');

			uploadDeferred.resolve(1234);
		});

		afterEach(() => {
			client.upload_image.restore();
			cache.delete.restore();
		});

		it('should upload to client, then delete', (done) => {
			const fakePath = 'fake/path/to/fakeimg.gif';

			images.upload_from_path(fakePath).then((id) => {
				try {
					expect(id).to.equal(1234);
					sinon.assert.calledOnce(client.upload_image);
					sinon.assert.calledWith(client.upload_image, fakePath, 'fakeimg.gif');

					sinon.assert.calledOnce(cache.delete);
					sinon.assert.calledWith(cache.delete, 'fakeimg.gif');
					done();
				} catch (err) {
					done(err);
				}
			});
		});
	});
});
