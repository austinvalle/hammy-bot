const sinon = require('sinon');
const expect = require('chai').expect;

const Q = require('q');
const rp = require('request-promise');
const videos = require('../src/modules/media/videos');

const gfycat = require('../src/modules/gfycat/gfycat');

describe('gfycat module', () => {
	describe('upload gfycat', () => {
		let rpDeferred,
			videoDeferred;

		beforeEach(() => {
			rpDeferred = Q.defer();
			videoDeferred = Q.defer();

			sinon.stub(rp, 'get').callsFake(() => {
				return rpDeferred.promise;
			});

			sinon.stub(videos, 'upload_from_url').callsFake(() => {
				return videoDeferred.promise;
			});

			rpDeferred.resolve({
				gfyItem: {
					mobileUrl: 'http://gfycat.com/fakename.mp4'
				}
			});
			videoDeferred.resolve({
				pictureId: 1234
			});
		});

		afterEach(() => {
			rp.get.restore();
			videos.upload_from_url.restore();
		});

		it('should call gfycat api for details, then upload to videos', (done) => {
			gfycat.upload_gfycat('fakename').then((msg) => {
				try {
					expect(msg.pictureId).to.equal(1234);
					sinon.assert.calledOnce(rp.get);
					sinon.assert.calledOnce(videos.upload_from_url);
					sinon.assert.calledWith(videos.upload_from_url, 'http://gfycat.com/fakename.mp4');
					done();
				} catch (err) {
					done(err);
				}
			});
		});
	});
});
