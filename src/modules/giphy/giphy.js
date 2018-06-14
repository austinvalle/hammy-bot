var Q = require('q');
var giphy = require('giphy-api')();
var images = require('../media/images');
var MessageBuilder = require('../../client').MessageBuilder;

var random_giphy = function(command){
    var deferred = Q.defer();

    var query = command.replace('!gif ', '');

    giphy.random({tag: query, rating: 'pg-13'}).then(function(res){
        images.upload_from_url(res.data.image_url).then(function(msg){
            deferred.resolve({
                pictureId: msg.pictureId
            });
        });
    });

    return deferred.promise;
};

module.exports = {
    random_giphy: random_giphy
};
