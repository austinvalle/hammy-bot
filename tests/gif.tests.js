const sinon = require('sinon');
const expect = require('chai').expect;
const rewire = require('rewire');

const cache = require('../src/modules/cache/cache');
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

		it('creates palette, then converts mp4 to gif', (done) => {
			const filename = 'file',
				path = '/fake/path/file.gif',
				start = 5,
				duration = 15;

			gif.convert_mp4(path, filename, start, duration).then((path) => {
				try {
					const paletteName = cache.PATH + filename + '.png',
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
