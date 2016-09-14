var sinon = require('sinon');
var expect = require('chai').expect;

var Q = require('q');
var rp = require('request-promise');
var images = require('../lib/modules/media/images');

var gfycat = require('../lib/modules/gfycat/gfycat');

describe('gfycat module', function() {
    describe('upload gfycat', function() {
        var rpDeferred,
            imgDeferred;

        beforeEach(function() {
            rpDeferred = Q.defer();
            imgDeferred = Q.defer();

            sinon.stub(rp, 'get', function(options) {
                return rpDeferred.promise;
            });

            sinon.stub(images, 'upload_from_url', function(url, fn) {
                return imgDeferred.promise;
            });

            rpDeferred.resolve({
                gfyItem: {
                    gifUrl: 'http://gfycat.com/fakename.gif'
                }
            });
            imgDeferred.resolve({
                pictureId: 1234
            });
        });

        afterEach(function() {
            rp.get.restore();
            images.upload_from_url.restore();
        });

        it('should call gfycat api for details, then upload to images', function(done) {
            gfycat.upload_gfycat('fakename').then(function(msg) {
                try {
                    expect(msg.pictureId).to.equal(1234);
                    sinon.assert.calledOnce(rp.get);
                    sinon.assert.calledOnce(images.upload_from_url);
                    sinon.assert.calledWith(images.upload_from_url, 'http://gfycat.com/fakename.gif', 'fakename.gif');
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });
});
