var sinon = require('sinon');
var expect = require('chai').expect;
var rewire = require("rewire");

var Q = require('q');
var videos = require('../lib/modules/media/videos');

var xboxClips = rewire('../lib/modules/xbox/xbox-clips');

describe('xbox-clips module', function() {
    describe('upload xboxdvr', function() {
        var videoDeferred;

        beforeEach(function() {
            videoDeferred = Q.defer();

            var XrayStub = function() {
                return function(url, tagSelector) {
                    return function(callback) {
                        callback(null, 'http://videocdn/video.mp4');
                    };
                };
            };

            xboxClips.__set__('Xray', XrayStub);

            sinon.stub(videos, 'upload_from_url', function(url, fn, id, duration) {
                return videoDeferred.promise;
            });

            videoDeferred.resolve(1234);
        });

        afterEach(function() {
            videos.upload_from_url.restore();
        });

        it('reads page for video source and uploads', function(done) {
            var url = 'http://www.xboxdvr.com/PUBA/clip1234';
            xboxClips.upload_xboxdvr_video(url).then(function(msg) {
                try {
                    expect(msg.pictureId).to.equal(1234);
                    sinon.assert.calledWith(videos.upload_from_url,
                        'http://videocdn/video.mp4',
                        '1234.mp4',
                        '1234', 28, 18);

                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });
});
