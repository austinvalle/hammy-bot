var sinon = require('sinon');
var expect = require('chai').expect;

var Q = require('q');
var rp = require('request-promise');
var videos = require('../lib/modules/media/videos');

var gfycat = require('../lib/modules/gfycat/gfycat');

describe('gfycat module', function() {
    describe('upload gfycat', function() {
        var rpDeferred,
            videoDeferred;

        beforeEach(function() {
            rpDeferred = Q.defer();
            videoDeferred = Q.defer();

            sinon.stub(rp, 'get', function(options) {
                return rpDeferred.promise;
            });

            sinon.stub(videos, 'upload_from_url', function(url, fn) {
                return videoDeferred.promise;
            });

            rpDeferred.resolve({
                gfyItem: {
                    mobileUrl: 'http://gfycat.com/fakename.mp4'
                }
            });
            videoDeferred.resolve(1234);
        });

        afterEach(function() {
            rp.get.restore();
            videos.upload_from_url.restore();
        });

        it('should call gfycat api for details, then upload to videos', function(done) {
            gfycat.upload_gfycat('fakename').then(function(msg) {
                try {
                    expect(msg.pictureId).to.equal(1234);
                    sinon.assert.calledOnce(rp.get);
                    sinon.assert.calledOnce(videos.upload_from_url);
                    sinon.assert.calledWith(videos.upload_from_url, 'http://gfycat.com/fakename.mp4', 'fakename.mp4');
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });
});
