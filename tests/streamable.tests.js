var sinon = require('sinon');
var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

var Q = require('q');
var rp = require('request-promise');
var videos = require('../lib/modules/media/videos');

var streamable = require('../lib/modules/streamable/streamable');

describe('streamable module', function() {
    describe('upload streamable', function() {
        var rpDeferred,
            videoDeferred;

        beforeEach(function() {
            rpDeferred = Q.defer();
            videoDeferred = Q.defer();

            sinon.stub(rp, 'get', function(options) {
                return rpDeferred.promise;
            });

            sinon.stub(videos, 'upload_from_url', function(url, fn, id, duration) {
                return videoDeferred.promise;
            });

            videoDeferred.resolve(1234);
        });

        afterEach(function() {
            rp.get.restore();
            videos.upload_from_url.restore();
        });

        it('should upload, has mp4 mobile and no title', function(done) {
            rpDeferred.resolve({
                files: {
                    'mp4': {},
                    'mp4-mobile': {
                        url: '//streamable.com/asdk-mobile.mp4'
                    }
                }
            });

            streamable.upload_streamable('http://streamable.com/asdk').then(function(msg) {
                try {
                    should.not.exist(msg.segments);
                    expect(msg.pictureId).to.equal(1234);
                    sinon.assert.calledOnce(rp.get);
                    sinon.assert.calledOnce(videos.upload_from_url);
                    sinon.assert.calledWith(videos.upload_from_url,
                        'https://streamable.com/asdk-mobile.mp4',
                        'asdk-mobile.mp4',
                        'asdk');

                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it('should upload, no mp4 mobile and has title', function(done) {
            rpDeferred.resolve({
                title: 'Fake title',
                files: {
                    'mp4': {
                        url: '//streamable.com/asdk.mp4'
                    }
                }
            });

            streamable.upload_streamable('http://streamable.com/asdk').then(function(msg) {
                try {
                    expect(msg.segments[0][1]).to.equal('Fake title');
                    expect(msg.pictureId).to.equal(1234);
                    sinon.assert.calledOnce(rp.get);
                    sinon.assert.calledOnce(videos.upload_from_url);
                    sinon.assert.calledWith(videos.upload_from_url,
                        'https://streamable.com/asdk.mp4',
                        'asdk.mp4',
                        'asdk');

                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });
});
