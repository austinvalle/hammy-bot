var gfycat = require('./modules/gfycat/gfycat');
var links = require('./modules/links/links');
var twitter = require('./modules/twitter/twitter');
var xbox = require('./modules/xbox/xbox');
var streamable = require('./modules/streamable/streamable');
var client = require('./client');

links.register();
twitter.register();
gfycat.register();
xbox.register();
streamable.register();
