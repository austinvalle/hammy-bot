var sinon = require('sinon');
var expect = require('chai').expect;
var rewire = require("rewire");

var Q = require('q');

var cache = require("../lib/modules/cache/cache");
var gif = rewire('../lib/modules/media/gif');

describe('gif module', function() {
    describe('convert mp4 to gif', function() {
        var ffmpegStub;

        beforeEach(function() {
            ffmpegStub = {
                seekInput: function(start) {},
                inputOptions: function(options) {},
                videoFilter: function(filter) {},
                save: function(path) {},
                on: function(mthd, callback) {},
                input: function(path) {},
                complexFilter: function(filter) {}
            };

            gif.__set__('ffmpeg', function(path) {
                return ffmpegStub
            });

            sinon.stub(ffmpegStub, 'seekInput', function(start) {
                return ffmpegStub;
            });
            sinon.stub(ffmpegStub, 'inputOptions', function(start) {
                return ffmpegStub;
            });
            sinon.stub(ffmpegStub, 'videoFilter', function(start) {
                return ffmpegStub;
            });
            sinon.stub(ffmpegStub, 'save', function(start) {
                return ffmpegStub;
            });
            sinon.stub(ffmpegStub, 'on').callsArg(1);
            sinon.stub(ffmpegStub, 'input', function(path) {
                return ffmpegStub;
            });
            sinon.stub(ffmpegStub, 'complexFilter', function(filter) {
                return ffmpegStub;
            });
            sinon.stub(cache, 'delete');
        });

        afterEach(function() {
            ffmpegStub.seekInput.restore();
            ffmpegStub.inputOptions.restore();
            ffmpegStub.videoFilter.restore();
            ffmpegStub.save.restore();
            ffmpegStub.on.restore();
            ffmpegStub.input.restore();
            ffmpegStub.complexFilter.restore();
            cache.delete.restore();
        });

        it('creates palette, then converts mp4 to gif', function(done) {
            var filename = 'file',
                path = '/fake/path/file.gif',
                start = 5,
                duration = 15;

            gif.convert_mp4(path, filename, start, duration).then(function(path) {
                try {
                    var paletteName = cache.PATH + filename + '.png',
                        gifName = cache.PATH + filename + '.gif';

                    expect(path).to.equal(cache.PATH + filename + '.gif');

                    sinon.assert.calledTwice(ffmpegStub.seekInput);
                    sinon.assert.alwaysCalledWith(ffmpegStub.seekInput, start);

                    sinon.assert.calledTwice(ffmpegStub.inputOptions);
                    sinon.assert.alwaysCalledWith(ffmpegStub.inputOptions, '-t ' + duration);

                    sinon.assert.calledOnce(ffmpegStub.videoFilter);
                    sinon.assert.calledWith(ffmpegStub.videoFilter, sinon.match.any);

                    sinon.assert.calledTwice(ffmpegStub.save);
                    sinon.assert.calledWith(ffmpegStub.save, paletteName);
                    sinon.assert.calledWith(ffmpegStub.save, gifName);

                    sinon.assert.calledTwice(ffmpegStub.on);
                    sinon.assert.alwaysCalledWith(ffmpegStub.on, 'end', sinon.match.any);

                    sinon.assert.calledOnce(ffmpegStub.input);
                    sinon.assert.calledWith(ffmpegStub.input, paletteName);

                    sinon.assert.calledOnce(ffmpegStub.complexFilter);
                    sinon.assert.calledWith(ffmpegStub.complexFilter, sinon.match.any);

                    sinon.assert.calledTwice(cache.delete);
                    sinon.assert.calledWith(cache.delete, filename + '.mp4');
                    sinon.assert.calledWith(cache.delete, filename + '.png');

                    done();
                } catch (err) {
                    done(err);
                }
            });
        });
    });
});
