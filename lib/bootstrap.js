var client = require('./client');

var gfycat = require('./modules/gfycat/gfycat');
var images = require('./modules/media/images');
var twitter = require('./modules/twitter/twitter');
var xbox = require('./modules/xbox/xbox');
var xboxclips = require('./modules/xbox/xbox-clips');
var streamable = require('./modules/streamable/streamable');

var initialize_client = function() {
    return client.connect_to_hangouts();
};

var register_modules = function() {
    images.register();
    twitter.register();
    gfycat.register();
    xbox.register();
    xboxclips.register();
    streamable.register();
};

module.exports = {
    initialize_client: initialize_client,
    register_modules: register_modules
};
