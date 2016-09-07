var Q = require('q');
var ffmpeg = require('fluent-ffmpeg');

var cache = require("../cache/cache");

module.exports = {
    convert_mp4: function(path, filename, start, duration) {
        var deferred = Q.defer();
        var paletteName = filename + '.png';
        var gifName = filename + '.gif';

        ffmpeg(path)
            .seekInput(start)
            .inputOptions('-t ' + duration)
            .videoFilter('fps=30,scale=400:-1:flags=lanczos,palettegen=stats_mode=diff')
            .save(cache.PATH + paletteName)
            .on('end', function() {
                ffmpeg(path)
                    .seekInput(start)
                    .inputOptions('-t ' + duration)
                    .input(cache.PATH + filename + '.png')
                    .complexFilter('fps=30,scale=400:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=none')
                    .save(cache.PATH + gifName)
                    .on('end', function() {
                        deferred.resolve(cache.PATH + gifName);
                        cache.delete(filename + '.mp4');
                        cache.delete(paletteName);
                    });
            });


        return deferred.promise;
    }
};
