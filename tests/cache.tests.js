const sinon = require('sinon');
const expect = require('chai').expect;
const rewire = require('rewire');

const fs = require('fs');
const request = require('request');

const cache = rewire('../src/modules/cache/cache');

describe('cache module', () => {
	describe('download from url', () => {
		let requestStub,
			ffmpegStub;

		beforeEach(() => {
			ffmpegStub = {
				ffprobe: function() {}
			};

			cache.__set__('ffmpeg', ffmpegStub);

			sinon.stub(ffmpegStub, 'ffprobe').callsArgWith(1, null, {
				format: {
					duration: 44
				}
			});

			sinon.stub(request, 'head').callsArgWith(1, null, {}, {});

			requestStub = {
				get: function() {
					return this;
				},
				pipe: function() {
					return this;
				},
				on: function() {
					return this;
				}
			};

			sinon.stub(request, 'get').callsFake(() => {
				return requestStub;
			});

			sinon.stub(requestStub, 'pipe').callsFake(() => {
				return requestStub;
			});

			sinon.stub(requestStub, 'on').callsArg(1);

			sinon.stub(fs, 'createWriteStream').callsFake(() => { });
		});

		afterEach(() => {
			request.head.restore();
			request.get.restore();
			fs.createWriteStream.restore();
			requestStub.pipe.restore();
			requestStub.on.restore();
		});

		it('should download file', async () => {
			const downloadUri = 'http://fakeurl/fakeimage.png';
			const filename = 'fakename.png';

			const path = await cache.download(downloadUri, filename);

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
		});

		it('should download file, then get metadata for video', async () => {
			const downloadUri = 'http://fakeurl/fakevideo.mp4';
			const filename = 'fakename.mp4';

			const response = await cache.download(downloadUri, filename);

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
		});
	});

	describe('delete file', () => {
		beforeEach(() => {
			sinon.stub(fs, 'unlink');
		});

		afterEach(() => {
			fs.unlink.restore();
		});

		it('should call delete on file path', () => {
			cache.delete('fakename');

			sinon.assert.calledOnce(fs.unlink);
			sinon.assert.calledWith(fs.unlink, cache.PATH + 'fakename');
		});
	});
});
