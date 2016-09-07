var gfycat = require('./modules/gfycat/gfycat');
var images = require('./modules/media/images');
var twitter = require('./modules/twitter/twitter');
var xbox = require('./modules/xbox/xbox');
var streamable = require('./modules/streamable/streamable');
var client = require('./client');

images.register();
twitter.register();
gfycat.register();
xbox.register();
streamable.register();
