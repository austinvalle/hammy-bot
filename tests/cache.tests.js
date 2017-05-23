var sinon = require('sinon');
var expect = require('chai').expect;
var rewire = require("rewire");

var fs = require('fs');
var request = require('request');

var cache = rewire('../lib/modules/cache/cache');

describe('cache module', function() {
    describe('download from url', function() {
        var requestStub,
            ffmpegStub;

        beforeEach(function() {
            ffmpegStub = {
                ffprobe: function(path, callback) {}
            };

            cache.__set__('ffmpeg', ffmpegStub);

            sinon.stub(ffmpegStub, 'ffprobe').callsArgWith(1, null, {
                format: {
                    duration: 44
                }
            });

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

            sinon.stub(request, 'get').callsFake(function(uri) {
                return requestStub;
            });

            sinon.stub(requestStub, 'pipe').callsFake(function(stream) {
                return requestStub;
            });

            sinon.stub(requestStub, 'on').callsArg(1);

            sinon.stub(fs, 'createWriteStream').callsFake(function(path) {});
        });

        afterEach(function() {
            request.head.restore();
            request.get.restore();
            fs.createWriteStream.restore();
            requestStub.pipe.restore();
            requestStub.on.restore();
        });

        it('should download file', function(done) {
            var downloadUri = 'http://fakeurl/fakeimage.png';
            var filename = 'fakename.png';

            cache.download(downloadUri, filename).then(function(path) {
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

        it('should download file, then get metadata for video', function(done) {
            var downloadUri = 'http://fakeurl/fakevideo.mp4';
            var filename = 'fakename.mp4';

            cache.download(downloadUri, filename).then(function(response) {
                try {
                    expect(response.path).to.equal(cache.PATH + filename);
                    expect(response.metadata.duration).to.equal(44);

                    sinon.assert.calledOnce(request.head);
                    sinon.assert.calledWith(request.head, downloadUri, sinon.match.any);

                    sinon.assert.calledOnce(request.get);
                    sinon.assert.calledWith(request.get, downloadUri);

                    sinon.assert.calledOnce(requestStub.pipe);

                    sinon.assert.calledOnce(fs.createWriteStream);
                    sinon.assert.calledWith(fs.createWriteStream, cache.PATH + filename);

                    sinon.assert.calledOnce(requestStub.on);
                    sinon.assert.calledWith(requestStub.on, 'close', sinon.match.any);

                    sinon.assert.calledOnce(ffmpegStub.ffprobe);
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
