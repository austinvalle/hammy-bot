var sinon = require('sinon');
var expect = require('chai').expect;

var Q = require('q');
var url = require('url');
var path = require('path');

var client = require('../lib/client');
var cache = require('../lib/modules/cache/cache');
var images = require('../lib/modules/media/images');

describe('images module', function() {
    describe('upload image from url', function() {
        var cacheDeferred,
            uploadDeferred,
            fakePath;

        beforeEach(function() {
            fakePath = 'fake/path/to/file';
            cacheDeferred = Q.defer();
            uploadDeferred = Q.defer();

            sinon.stub(cache, 'download', function(pUrl, fn) {
                return cacheDeferred.promise;
            });

            sinon.stub(client, 'upload_image', function(path, fn) {
                return uploadDeferred.promise;
            });

            sinon.stub(cache, 'delete');

            cacheDeferred.resolve(fakePath);
            uploadDeferred.resolve(1234);
        });

        afterEach(function() {
            cache.download.restore();
            client.upload_image.restore();
            cache.delete.restore();
        });

        it('w/o filename: should download to cache, upload to client, then delete', function(done) {
            var pictureUrl = 'http://fakeurl/fakeimage123.jpg';
            var expectedFilename = 'fakeimage123.jpg';

            images.upload_from_url(pictureUrl).then(function(msg) {
                try {
                    expect(msg.pictureId).to.equal(1234);
                    sinon.assert.calledOnce(cache.download);
                    sinon.assert.calledWith(cache.download, pictureUrl, expectedFilename);

                    sinon.assert.calledOnce(client.upload_image);
                    sinon.assert.calledWith(client.upload_image, fakePath, expectedFilename);

                    sinon.assert.calledOnce(cache.delete);
                    sinon.assert.calledWith(cache.delete, expectedFilename);
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });

    describe('upload image from path', function() {
        var uploadDeferred;

        beforeEach(function() {
            uploadDeferred = Q.defer();

            sinon.stub(client, 'upload_image', function(path, fn) {
                return uploadDeferred.promise;
            });

            sinon.stub(cache, 'delete');

            uploadDeferred.resolve(1234);
        });

        afterEach(function() {
            client.upload_image.restore();
            cache.delete.restore();
        });

        it('should upload to client, then delete', function(done) {
            var fakePath = 'fake/path/to/fakeimg.gif';
            var filename = 'fakeimg.gif';

            images.upload_from_path(fakePath, filename).then(function(id) {
                try {
                    expect(id).to.equal(1234);
                    sinon.assert.calledOnce(client.upload_image);
                    sinon.assert.calledWith(client.upload_image, fakePath, filename);

                    sinon.assert.calledOnce(cache.delete);
                    sinon.assert.calledWith(cache.delete, filename);
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });
});
