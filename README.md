hammy-bot
=========

![hammy-bot logo](logo.png)

Modular bot framework for google hangouts built w/ nodejs and [hangupsjs](https://github.com/yakyak/hangupsjs).

Primarily used to monitor group-chats, provide added context to links (tweets, images, animated gifs, etc.) and accept commands from users to perform various tasks. 

## what hammy-bot can do

* Post GIFs from gfycat

![gfycat example](http://i.imgur.com/bNhzBDA.gif)

* Get the xbox online status of users defined in the configuration file

![!whosonline example](http://i.imgur.com/NA885cU.png)

* Post direct url images/videos for JPG,PNG,JPEG,GIF,MP4 links

![direct url example](http://i.imgur.com/iv878LP.png)

* Post GIFs from streamable urls

![direct url example](http://i.imgur.com/zUxQSJI.gif)

* Post twitter status, images, and gifs

![twitter example](http://i.imgur.com/l4MtEPK.png)

* Post GIFs from xboxdvr urls

![xbox dvr example](http://i.imgur.com/LBpKKg8.gif)


## APIs currently in use
* [Gfycat](https://gfycat.com/api)
* [Twitter](https://dev.twitter.com/rest/public)
* [XboxAPI](https://xboxapi.com/)
* [Streamable](https://streamable.com/documentation)
* [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg) (Requires ffmpeg binaries installed)
