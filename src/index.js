var gfycat = require('./modules/gfycat/gfycat');
var links = require('./modules/links/links');
var twitter = require('./modules/twitter/twitter');
var client = require('./client');

links.register();
twitter.register();
gfycat.register();
