var sinon = require('sinon');
var expect = require('chai').expect;

var Q = require('q');

var cache = require('../lib/modules/cache/cache');
var images = require('../lib/modules/media/images');
var gif = require('../lib/modules/media/gif');
var videos = require('../lib/modules/media/videos');

describe('videos module', function() {
    describe('upload from url', function() {
        var cacheDeferred,
            gifDeferred,
            uploadDeferred,
            fakePath;

        beforeEach(function() {
            fakePath = 'fake/path/to/file';
            cacheDeferred = Q.defer();
            gifDeferred = Q.defer();
            uploadDeferred = Q.defer();

            sinon.stub(cache, 'download', function(pUrl, fn) {
                return cacheDeferred.promise;
            });
            sinon.stub(gif, 'convert_mp4', function(path, id, start, duration) {
                return gifDeferred.promise;
            });
            sinon.stub(images, 'upload_from_path', function(path, fn) {
                return uploadDeferred.promise;
            });

            gifDeferred.resolve(fakePath + '.gif');
            uploadDeferred.resolve(1234);
        });

        afterEach(function() {
            cache.download.restore();
            gif.convert_mp4.restore();
            images.upload_from_path.restore();
        });

        it('w/ start param: should download, convert, and upload gif', function(done) {
            var videoUrl = 'http://fakeurl/fakevideo.mp4',
                filename = 'fakevideo.mp4',
                uniqueId = 'fakevideo',
                start = 25;

            cacheDeferred.resolve({
                path: fakePath,
                metadata: {
                    duration: 30
                }
            });

            videos.upload_from_url(videoUrl, filename, uniqueId, start).then(function(id) {
                try {
                    expect(id).to.equal(1234);
                    sinon.assert.calledOnce(cache.download);
                    sinon.assert.calledWith(cache.download, videoUrl, filename);

                    sinon.assert.calledOnce(gif.convert_mp4);
                    sinon.assert.calledWith(gif.convert_mp4, fakePath, uniqueId, start, 30);

                    sinon.assert.calledOnce(images.upload_from_path);
                    sinon.assert.calledWith(images.upload_from_path, fakePath + '.gif', uniqueId + '.gif');
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it('duration <= 10: should download, convert, and upload gif', function(done) {
            var videoUrl = 'http://fakeurl/fakevideo.mp4',
                filename = 'fakevideo.mp4',
                uniqueId = 'fakevideo';

            cacheDeferred.resolve({
                path: fakePath,
                metadata: {
                    duration: 9
                }
            });

            videos.upload_from_url(videoUrl, filename, uniqueId).then(function(id) {
                try {
                    expect(id).to.equal(1234);
                    sinon.assert.calledOnce(cache.download);
                    sinon.assert.calledWith(cache.download, videoUrl, filename);

                    sinon.assert.calledOnce(gif.convert_mp4);
                    sinon.assert.calledWith(gif.convert_mp4, fakePath, uniqueId, 0, 9);

                    sinon.assert.calledOnce(images.upload_from_path);
                    sinon.assert.calledWith(images.upload_from_path, fakePath + '.gif', uniqueId + '.gif');
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it('duration <= 15: should download, convert, and upload gif', function(done) {
            var videoUrl = 'http://fakeurl/fakevideo.mp4',
                filename = 'fakevideo.mp4',
                uniqueId = 'fakevideo';

            cacheDeferred.resolve({
                path: fakePath,
                metadata: {
                    duration: 13
                }
            });

            videos.upload_from_url(videoUrl, filename, uniqueId).then(function(id) {
                try {
                    expect(id).to.equal(1234);
                    sinon.assert.calledOnce(cache.download);
                    sinon.assert.calledWith(cache.download, videoUrl, filename);

                    sinon.assert.calledOnce(gif.convert_mp4);
                    sinon.assert.calledWith(gif.convert_mp4, fakePath, uniqueId, 3, 10);

                    sinon.assert.calledOnce(images.upload_from_path);
                    sinon.assert.calledWith(images.upload_from_path, fakePath + '.gif', uniqueId + '.gif');
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });

        it('duration > 15: should download, convert, and upload gif', function(done) {
            var videoUrl = 'http://fakeurl/fakevideo.mp4',
                filename = 'fakevideo.mp4',
                uniqueId = 'fakevideo';

            cacheDeferred.resolve({
                path: fakePath,
                metadata: {
                    duration: 25
                }
            });

            videos.upload_from_url(videoUrl, filename, uniqueId).then(function(id) {
                try {
                    expect(id).to.equal(1234);
                    sinon.assert.calledOnce(cache.download);
                    sinon.assert.calledWith(cache.download, videoUrl, filename);

                    sinon.assert.calledOnce(gif.convert_mp4);
                    sinon.assert.calledWith(gif.convert_mp4, fakePath, uniqueId, 5, 10);

                    sinon.assert.calledOnce(images.upload_from_path);
                    sinon.assert.calledWith(images.upload_from_path, fakePath + '.gif', uniqueId + '.gif');
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });
});
