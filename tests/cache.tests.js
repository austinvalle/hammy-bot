var sinon = require('sinon');
var expect = require('chai').expect;

var fs = require('fs');
var request = require('request');

var cache = require('../lib/modules/cache/cache');

describe('cache module', function() {
    describe('download from url', function() {
        var requestStub;

        beforeEach(function() {
            sinon.stub(request, 'head').callsArgWith(1, null, {}, {});

            requestStub = {
                get: function(uri) {
                    return this;
                },
                pipe: function(stream) {
                    return this
                },
                on: function() {
                    return this;
                }
            };

            sinon.stub(request, 'get', function(uri) {
                return requestStub;
            });

            sinon.stub(requestStub, 'pipe', function(stream) {
                return requestStub;
            });

            sinon.stub(requestStub, 'on').callsArg(1);

            sinon.stub(fs, 'createWriteStream', function(path) {});
        });

        afterEach(function() {
            request.head.restore();
            request.get.restore();
            fs.createWriteStream.restore();
            requestStub.pipe.restore();
            requestStub.on.restore();
        });

        it('should call url with HEAD, then GET, and then write to stream', function(done) {
            var downloadUri = 'http://fakeurl/fakeimage.png';
            var filename = 'fakename';
            cache.download(downloadUri, 'fakename').then(function(path) {
                try {
                    expect(path).to.equal(cache.PATH + filename);
                    sinon.assert.calledOnce(request.head);
                    sinon.assert.calledWith(request.head, downloadUri, sinon.match.any);

                    sinon.assert.calledOnce(request.get);
                    sinon.assert.calledWith(request.get, downloadUri);

                    sinon.assert.calledOnce(requestStub.pipe);

                    sinon.assert.calledOnce(fs.createWriteStream);
                    sinon.assert.calledWith(fs.createWriteStream, cache.PATH + filename);

                    sinon.assert.calledOnce(requestStub.on);
                    sinon.assert.calledWith(requestStub.on, 'close', sinon.match.any);
                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });

    describe('delete file', function() {
        beforeEach(function() {
            sinon.stub(fs, 'unlink');
        });

        afterEach(function() {
            fs.unlink.restore();
        });

        it('should call delete on file path', function(done) {
            cache.delete('fakename');
            try {
                sinon.assert.calledOnce(fs.unlink);
                sinon.assert.calledWith(fs.unlink, cache.PATH + 'fakename');
                done();
            } catch (err) {
                done(err);
            }
        });
    });
});
