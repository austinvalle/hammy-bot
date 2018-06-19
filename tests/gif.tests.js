const sinon = require('sinon');
const expect = require('chai').expect;
const rewire = require('rewire');

const cache = require('../src/modules/cache/cache');
const images = require('../src/modules/media/images');
const gif = rewire('../src/modules/media/gif');

describe('gif module', () => {
	describe('convert mp4 to gif', () => {
		let ffmpegStub;

		beforeEach(() => {
			ffmpegStub = {
				seekInput: () => {},
				inputOptions: () => {},
				videoFilter: () => {},
				save: () => {},
				on: () => {},
				input: () => {},
				complexFilter: () => {}
			};

			gif.__set__('ffmpeg', () => {
				return ffmpegStub;
			});

			sinon.stub(ffmpegStub, 'seekInput').callsFake(() => {
				return ffmpegStub;
			});
			sinon.stub(ffmpegStub, 'inputOptions').callsFake(() => {
				return ffmpegStub;
			});
			sinon.stub(ffmpegStub, 'videoFilter').callsFake(() => {
				return ffmpegStub;
			});
			sinon.stub(ffmpegStub, 'save').callsFake(() => {
				return ffmpegStub;
			});
			sinon.stub(ffmpegStub, 'on').callsArg(1);
			sinon.stub(ffmpegStub, 'input').callsFake(() => {
				return ffmpegStub;
			});
			sinon.stub(ffmpegStub, 'complexFilter').callsFake(() => {
				return ffmpegStub;
			});
			sinon.stub(cache, 'delete');
		});

		afterEach(() => {
			ffmpegStub.seekInput.restore();
			ffmpegStub.inputOptions.restore();
			ffmpegStub.videoFilter.restore();
			ffmpegStub.save.restore();
			ffmpegStub.on.restore();
			ffmpegStub.input.restore();
			ffmpegStub.complexFilter.restore();
			cache.delete.restore();
		});

		it('creates palette, then converts mp4 to gif', async () => {
			const filename = 'file',
				path = '/fake/path/file.gif',
				start = 5,
				duration = 15;

			const imagePath = await gif.convert_mp4(path, filename, start, duration);

			const paletteName = cache.PATH + filename + '.png',
				gifName = cache.PATH + filename + '.gif';

			expect(imagePath).to.equal(cache.PATH + filename + '.gif');

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
		});
	});
	describe('search for random gif', () => {
		let giphyMock;

		beforeEach(() => {
			giphyMock = {
				random: async () => { }
			};

			gif.__set__('giphy', giphyMock);

			sinon.stub(giphyMock, 'random').callsFake(async () => {
				return {
					data: {
						image_url: 'http://fakeurl/lelbron.gif'
					}
				};
			});

			sinon.stub(images, 'upload_from_url').callsFake(async () => {
				return { pictureId: '123' };
			});
		});

		afterEach(() => {
			giphyMock.random.restore();
			images.upload_from_url.restore();
		});

		it('calls giphy api and uploads the gif from URL', async () => {
			const msg = await gif.random_gif('!gif lelbron');

			expect(msg.pictureId).to.equal('123');

			sinon.assert.calledOnce(images.upload_from_url);
			sinon.assert.calledWith(images.upload_from_url, 'http://fakeurl/lelbron.gif');
			sinon.assert.calledOnce(giphyMock.random);
			sinon.assert.calledWith(giphyMock.random, {tag: 'lelbron', rating: 'pg-13'});
		});
	});
});
