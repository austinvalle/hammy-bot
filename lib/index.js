var hangouts = require('./hangouts');
var client = require('./client');
var CONFIG = require('./config');

var gfycat = require('./modules/gfycat/gfycat');
var images = require('./modules/media/images');
var twitter = require('./modules/twitter/twitter');
var xbox = require('./modules/xbox/xbox');
var xboxclips = require('./modules/xbox/xbox-clips');
var streamable = require('./modules/streamable/streamable');

hangouts.connect()
    .then(function(hangoutsClient) {
        return client.init(hangoutsClient);
    })
    .then(function(hangoutsClient) {

        images.register();
        twitter.register();
        gfycat.register();
        xbox.register();
        xboxclips.register();
        streamable.register();

        hangoutsClient.sendchatmessage(CONFIG.CLIENT_ID, [
            [0, 'Connected.']
        ]);
    });
