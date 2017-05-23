var sinon = require('sinon');
var chai = require('chai');
var rewire = require("rewire");

var expect = chai.expect;
var should = chai.should();

var Q = require('q');
var images = require('../lib/modules/media/images');
var videos = require('../lib/modules/media/videos');

var twitter = rewire('../lib/modules/twitter/twitter');

describe('twitter module', function() {
    describe('upload twitter status', function() {
        var imgDeferred,
            videoDeferred,
            fakeTwitterClient,
            twitterClientStub;

        beforeEach(function() {
            imgDeferred = Q.defer();
            videoDeferred = Q.defer();

            fakeTwitterClient = {
                get: function(url, options, callback) {}
            };

            twitter.__set__('twitter_client', fakeTwitterClient);

            twitterClientStub = sinon.stub(fakeTwitterClient, 'get');

            sinon.stub(videos, 'upload_from_url').callsFake(function(url, start) {
                return videoDeferred.promise;
            });

            sinon.stub(images, 'upload_from_url').callsFake(function(url) {
                return imgDeferred.promise;
            });

            imgDeferred.resolve({
                pictureId: 1234
            });

            videoDeferred.resolve({
                pictureId: 12345678
            });
        });

        afterEach(function() {
            images.upload_from_url.restore();
            videos.upload_from_url.restore();
        });

        it('if no additional media: return tweet text', function(done) {
            var statusId = '12345678',
                twitterUrl = ' https://twitter.com/FakeProfile/status/' + statusId,
                twitterData = {
                    text: 'Here is a fake tweet bro!',
                    user: {
                        screen_name: 'FakeTweeter123'
                    }
                };
            twitterClientStub.callsArgWith(2, null, twitterData, null);

            twitter.upload_twitter_status(twitterUrl).then(function(msg) {
                try {
                    should.not.exist(msg.pictureId);
                    expect(msg.segments[0][1]).to.equal('"' + twitterData.text + '"');
                    expect(msg.segments[2][1]).to.equal('@' + twitterData.user.screen_name);
                    sinon.assert.notCalled(images.upload_from_url);
                    sinon.assert.notCalled(videos.upload_from_url);

                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it('if photo attached: return tweet text and uploaded photo id', function(done) {
            var statusId = '12345678',
                twitterUrl = ' https://twitter.com/FakeProfile/status/' + statusId,
                twitterData = {
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
                };
            twitterClientStub.callsArgWith(2, null, twitterData, null);

            twitter.upload_twitter_status(twitterUrl).then(function(msg) {
                try {
                    expect(msg.pictureId).to.equal(1234);
                    expect(msg.segments[0][1]).to.equal('"' + twitterData.text + '"');
                    expect(msg.segments[2][1]).to.equal('@' + twitterData.user.screen_name);

                    sinon.assert.calledOnce(images.upload_from_url);
                    sinon.assert.calledWith(images.upload_from_url,
                        twitterData.extended_entities.media[0].media_url);

                    sinon.assert.notCalled(videos.upload_from_url);

                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it('if animated gif attached: return tweet text and uploaded gif id', function(done) {
            var statusId = '12345678',
                twitterUrl = ' https://twitter.com/FakeProfile/status/' + statusId,
                twitterData = {
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
                };
            twitterClientStub.callsArgWith(2, null, twitterData, null);

            twitter.upload_twitter_status(twitterUrl).then(function(msg) {
                try {
                    expect(msg.pictureId).to.equal(12345678);
                    expect(msg.segments[0][1]).to.equal('"' + twitterData.text + '"');
                    expect(msg.segments[2][1]).to.equal('@' + twitterData.user.screen_name);

                    sinon.assert.notCalled(images.upload_from_url);

                    sinon.assert.calledOnce(videos.upload_from_url);
                    sinon.assert.calledWith(videos.upload_from_url,
                        twitterData.extended_entities.media[0].video_info.variants[0].url);

                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it('if native video attached: return tweet text and uploaded gif id', function(done) {
            var statusId = '12345678',
                twitterUrl = ' https://twitter.com/FakeProfile/status/' + statusId,
                twitterData = {
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
                };
            twitterClientStub.callsArgWith(2, null, twitterData, null);

            twitter.upload_twitter_status(twitterUrl).then(function(msg) {
                try {
                    expect(msg.pictureId).to.equal(12345678);
                    expect(msg.segments[0][1]).to.equal('"' + twitterData.text + '"');
                    expect(msg.segments[2][1]).to.equal('@' + twitterData.user.screen_name);

                    sinon.assert.notCalled(images.upload_from_url);

                    sinon.assert.calledOnce(videos.upload_from_url);
                    sinon.assert.calledWith(videos.upload_from_url,
                        twitterData.extended_entities.media[0].video_info.variants[1].url);

                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });
});
