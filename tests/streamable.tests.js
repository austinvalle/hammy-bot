const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();

const Q = require('q');
const rp = require('request-promise');
const videos = require('../src/modules/media/videos');

const streamable = require('../src/modules/streamable/streamable');

describe('streamable module', () => {
	describe('upload streamable', () => {
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

			videoDeferred.resolve({
				pictureId: 1234
			});
		});

		afterEach(() => {
			rp.get.restore();
			videos.upload_from_url.restore();
		});

		it('should upload, has mp4 mobile and no title', async () => {
			rpDeferred.resolve({
				files: {
					'mp4': {},
					'mp4-mobile': {
						url: '//streamable.com/asdk-mobile.mp4'
					}
				}
			});

			const msg = await streamable.upload_streamable('http://streamable.com/asdk');

			should.not.exist(msg.segments);
			expect(msg.pictureId).to.equal(1234);
			sinon.assert.calledOnce(rp.get);
			sinon.assert.calledOnce(videos.upload_from_url);
			sinon.assert.calledWith(videos.upload_from_url, 'https://streamable.com/asdk-mobile.mp4');
		});

		it('should upload, no mp4 mobile and has title', async () => {
			rpDeferred.resolve({
				title: 'Fake title',
				files: {
					'mp4': {
						url: '//streamable.com/asdk.mp4'
					}
				}
			});

			const msg = await streamable.upload_streamable('http://streamable.com/asdk');

			expect(msg.segments[0][1]).to.equal('Fake title');
			expect(msg.pictureId).to.equal(1234);
			sinon.assert.calledOnce(rp.get);
			sinon.assert.calledOnce(videos.upload_from_url);
			sinon.assert.calledWith(videos.upload_from_url, 'https://streamable.com/asdk.mp4');
		});
	});
});
