var HangoutClient = require('hangupsjs');
var Q = require('q');

var connect = function() {
    var deferred = Q.defer();

    var client = new HangoutClient();
    client.loglevel('error');

    var credentials = function() {
        return {
            auth: HangoutClient.authStdin
        };
    };

    client.connect(credentials).then(function() {
        console.log('Successfully connected to Google Hangouts');

        client.TypingStatus = HangoutClient.TypingStatus;
        deferred.resolve(client);
    });

    return deferred.promise;
};

module.exports = {
    connect: connect
};
