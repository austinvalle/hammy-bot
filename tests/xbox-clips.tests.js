const sinon = require('sinon');
const expect = require('chai').expect;
const rewire = require('rewire');

const Q = require('q');
const videos = require('../src/modules/media/videos');

const xboxClips = rewire('../src/modules/xbox/xbox-clips');

describe('xbox-clips module', () => {
	describe('upload xboxdvr', () => {
		let videoDeferred;

		beforeEach(() => {
			videoDeferred = Q.defer();

			const XrayStub = function() {
				return () => {
					return (callback) => {
						callback(null, 'http://videocdn/video.mp4');
					};
				};
			};

			xboxClips.__set__('Xray', XrayStub);

			sinon.stub(videos, 'upload_from_url').callsFake(() => {
				return videoDeferred.promise;
			});

			videoDeferred.resolve({
				pictureId: 1234
			});
		});

		afterEach(() => {
			videos.upload_from_url.restore();
		});

		it('reads page for video source and uploads', (done) => {
			const url = 'http://www.xboxdvr.com/PUBA/clip1234';
			xboxClips.upload_xboxdvr_video(url).then((msg) => {
				try {
					expect(msg.pictureId).to.equal(1234);
					sinon.assert.calledWith(videos.upload_from_url,
						'http://videocdn/video.mp4', 18);

					done();
				} catch (err) {
					done(err);
				}
			});
		});
	});
});
