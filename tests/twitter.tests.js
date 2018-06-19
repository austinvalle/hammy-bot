const sinon = require('sinon');
const chai = require('chai');
const rewire = require('rewire');

const expect = chai.expect;
const should = chai.should();

const Q = require('q');
const images = require('../src/modules/media/images');
const videos = require('../src/modules/media/videos');

process.env.TWITTER_CONSUMER_KEY = 'FAKECONSUMERKEY';
process.env.TWITTER_CONSUMER_SECRET = 'FAKECONSUMERSECRET';
process.env.TWITTER_ACCESS_TOKEN = 'FAKEACCESSTOKEN';
process.env.TWITTER_ACCESS_TOKEN_SECRET = 'FAKEACCESSSECRET';

const twitter = rewire('../src/modules/twitter/twitter');

describe('twitter module', () => {
	describe('upload twitter status', () => {
		let imgDeferred,
			videoDeferred,
			fakeTwitterClient,
			twitterClientStub;

		beforeEach(() => {
			imgDeferred = Q.defer();
			videoDeferred = Q.defer();

			fakeTwitterClient = {
				get: function() {}
			};

			twitter.__set__('twitter_client', fakeTwitterClient);

			twitterClientStub = sinon.stub(fakeTwitterClient, 'get');

			sinon.stub(videos, 'upload_from_url').callsFake(() => {
				return videoDeferred.promise;
			});

			sinon.stub(images, 'upload_from_url').callsFake(() => {
				return imgDeferred.promise;
			});

			imgDeferred.resolve({
				pictureId: 1234
			});

			videoDeferred.resolve({
				pictureId: 12345678
			});
		});

		afterEach(() => {
			images.upload_from_url.restore();
			videos.upload_from_url.restore();
		});

		it('if no additional media: return tweet text', (done) => {
			const statusId = '12345678',
				twitterUrl = ' https://twitter.com/FakeProfile/status/' + statusId,
				twitterData = {
					data: {
						text: 'Here is a fake tweet bro!',
						user: {
							screen_name: 'FakeTweeter123'
						}
					}
				};
			twitterClientStub.resolves(twitterData);

			twitter.upload_twitter_status(twitterUrl).then((msg) => {
				try {
					should.not.exist(msg.pictureId);
					expect(msg.segments[0][1]).to.equal('"' + twitterData.data.text + '"');
					expect(msg.segments[2][1]).to.equal('@' + twitterData.data.user.screen_name);
					sinon.assert.notCalled(images.upload_from_url);
					sinon.assert.notCalled(videos.upload_from_url);

					done();
				} catch (err) {
					done(err);
				}
			});
		});

		it('if photo attached: return tweet text and uploaded photo id', (done) => {
			const statusId = '12345678',
				twitterUrl = ' https://twitter.com/FakeProfile/status/' + statusId,
				twitterData = {
					data: {
						text: 'Here is a fake tweet with a picture bro!',
						user: {
							screen_name: 'FakeTweeter123'
						},
						extended_entities: {
							media: [{
								type: 'photo',
								media_url: 'http://fakeurl/fakepicture.jpg'
							}]
						}
					}
				};
			twitterClientStub.resolves(twitterData);

			twitter.upload_twitter_status(twitterUrl).then((msg) => {
				try {
					expect(msg.pictureId).to.equal(1234);
					expect(msg.segments[0][1]).to.equal('"' + twitterData.data.text + '"');
					expect(msg.segments[2][1]).to.equal('@' + twitterData.data.user.screen_name);

					sinon.assert.calledOnce(images.upload_from_url);
					sinon.assert.calledWith(images.upload_from_url,
						twitterData.data.extended_entities.media[0].media_url);

					sinon.assert.notCalled(videos.upload_from_url);

					done();
				} catch (err) {
					done(err);
				}
			});
		});

		it('if animated gif attached: return tweet text and uploaded gif id', (done) => {
			const statusId = '12345678',
				twitterUrl = ' https://twitter.com/FakeProfile/status/' + statusId,
				twitterData = {
					data: {
						text: 'Here is a fake tweet with a gif bro!',
						user: {
							screen_name: 'FakeTweeter123'
						},
						extended_entities: {
							media: [{
								type: 'animated_gif',
								video_info: {
									variants: [{
										url: 'http://fakeurl/fakegif.mp4'
									}]
								}
							}]
						}
					}
				};
			twitterClientStub.resolves(twitterData);

			twitter.upload_twitter_status(twitterUrl).then((msg) => {
				try {
					expect(msg.pictureId).to.equal(12345678);
					expect(msg.segments[0][1]).to.equal('"' + twitterData.data.text + '"');
					expect(msg.segments[2][1]).to.equal('@' + twitterData.data.user.screen_name);

					sinon.assert.notCalled(images.upload_from_url);

					sinon.assert.calledOnce(videos.upload_from_url);
					sinon.assert.calledWith(videos.upload_from_url,
						twitterData.data.extended_entities.media[0].video_info.variants[0].url);

					done();
				} catch (err) {
					done(err);
				}
			});
		});

		it('if native video attached: return tweet text and uploaded gif id', (done) => {
			const statusId = '12345678',
				twitterUrl = ' https://twitter.com/FakeProfile/status/' + statusId,
				twitterData = {
					data: {
						text: 'Here is a fake tweet with a gif bro!',
						user: {
							screen_name: 'FakeTweeter123'
						},
						extended_entities: {
							media: [{
								type: 'video',
								video_info: {
									variants: [{
										content_type: 'video/mp4',
										bitrate: 32000,
										url: 'http://fakeurl/fakesmallvideo.mp4'
									}, {
										content_type: 'video/mp4',
										bitrate: 832000,
										url: 'http://fakeurl/fakevideo.mp4'
									}]
								}
							}]
						}
					}
				};
			twitterClientStub.resolves(twitterData);

			twitter.upload_twitter_status(twitterUrl).then((msg) => {
				try {
					expect(msg.pictureId).to.equal(12345678);
					expect(msg.segments[0][1]).to.equal('"' + twitterData.data.text + '"');
					expect(msg.segments[2][1]).to.equal('@' + twitterData.data.user.screen_name);

					sinon.assert.notCalled(images.upload_from_url);

					sinon.assert.calledOnce(videos.upload_from_url);
					sinon.assert.calledWith(videos.upload_from_url,
						twitterData.data.extended_entities.media[0].video_info.variants[1].url);

					done();
				} catch (err) {
					done(err);
				}
			});
		});
	});
});
