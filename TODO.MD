- refactor
    - expose functions in modules for internal function calls
    - on message should only check regex then call exposed function
    - change modules code to be easier to read and reuse functionality

- gfycat
    - use gifItem.gifSize to send message to hangouts saying it's massive?

- video game releases
    - giantbomb has an api for games filtered by date
        - get today, tomorrow, this week, this month, this year

- top words of hangouts
    - get conversation history
- reddit
    - get top most comment on reddit thread
    - get top 5 on reddit thread
    - get description of reddit thread

- rename chat
- weather by zip
- set timer, then show message
- search for random gif on giphy and send

- image shortcuts
    - whynotboth.gif, what.gif, otherstuff.gif
    - allow registering of keyword gif w/ some input
        - add flag? then use existing modules?
        - "!shortcut https://gyfcat.com/ThisIsFake thisisfake.gif"
        - "!shortcut https://imgur.com/thisisfake.gif fake.gif"
        - "!shortcut https://imgur.com/notcoolimage.jpg notcool.jpg"

- movie times by request "!movietimes %moviename% %zipcode%" or "!movietimes %zipcode%"
    - use showtimes api https://github.com/erunion/showtimes
- tell me a joke. "!joke"
