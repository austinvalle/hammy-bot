hammy-bot 
[![Release](https://img.shields.io/github/release/moosebot/hammy-bot.svg)](https://github.com/moosebot/hammy-bot)
[![Build Status](https://img.shields.io/travis/moosebot/hammy-bot/master.svg)](https://travis-ci.org/moosebot/hammy-bot)
=========
<p align="center">
 <img src="logo.png" width="700">
</p>

*Logo design by [Gina Rasicci](http://www.ginarasicci.com/)*
<hr>

Modular bot for google hangouts built w/ nodejs and [hangupsjs](https://github.com/yakyak/hangupsjs/) .

Primarily used to monitor group-chats, provide added context to links (tweets, images, animated gifs, etc.) and accept commands from users to perform various tasks.

## setting up hammy

* download hammy-bot from github
* set following environment variables to enable Twitter
  * TWITTER_CONSUMER_KEY
  * TWITTER_CONSUMER_SECRET
  * TWITTER_ACCESS_TOKEN
  * TWITTER_ACCESS_TOKEN_SECRET
* open cmd prompt and navigate to hammy-bot directory
* run "npm start"
* follow prompts on cmd prompt to enter authorization token
  * There is currently an outstanding issue with hangupsjs, until there is a workaround/resolution, you won't be able to start hammy
  * see [hangupsjs issue](https://github.com/yakyak/hangupsjs/issues/52) and [hangups issue](https://github.com/tdryer/hangups/issues/260)

## what hammy can do

* Post GIFs from gfycat

![gfycat example](/examples/gyfcat.gif)

* Post direct url images/videos for JPG,PNG,JPEG,GIF,MP4 links

![direct url example](/examples/direct_urls.gif)

* Post GIFs from streamable urls

![streamable example](/examples/streamable.gif)

* Post twitter status, images, and gifs

![twitter example](/examples/twitter.png)

* Post GIFs from xboxdvr urls

![xbox dvr example](/examples/xboxdvr.gif)

* Post random GIFs provided by Giphy

![random giphy example](/examples/random_gifs.gif)


## APIs currently in use
* [Gfycat](https://gfycat.com/api)
* [Giphy](https://github.com/Giphy/GiphyAPI)
* [Twitter](https://dev.twitter.com/rest/public)
* [Streamable](https://streamable.com/documentation)
* [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) (Requires ffmpeg binaries installed)
