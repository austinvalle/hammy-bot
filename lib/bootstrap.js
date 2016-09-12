var client = require('./client');
var CONFIG = require('./config/config');
var message_events = require('./modules/active').message_events;

var initialize_client = function() {
    return client.connect_to_hangouts();
};

var register_events = function() {
    client.chat.on('message', function(ev, msg) {
        for (var i = 0; i < message_events.length; i++) {
            var message_event = message_events[i];
            var matches = msg.match(message_event.regex);

            if (matches) {
                client.start_typing(ev);
                if (message_event.allow_multiple) {
                    for (var m = 0; m < matches.length; m++) {
                        message_event.callback(matches[m]);
                    }
                } else {
                    message_event.callback(matches[0]).then(function(msg) {
                        return client.send_message(CONFIG.CLIENT_ID, msg.segments, msg.pictureId);
                    }).then(function() {
                        client.stop_typing(ev);
                    });
                }
            }
        }
    });
};

module.exports = {
    initialize_client: initialize_client,
    register_events: register_events
};
