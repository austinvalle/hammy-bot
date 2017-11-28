var HangoutClient = require('hangupsjs');
var Q = require('q');
var events = require("events");

var client = new HangoutClient();
var chat = new events.EventEmitter();

chat.setMaxListeners(50);

var connect_to_hangouts = function() {
    var deferred = Q.defer();

    client.loglevel('error');

    var credentials = function() {
        return {
            auth: HangoutClient.authStdin
        };
    };

    client.connect(credentials).then(function() {
        client.on('chat_message', function(ev) {
            if (ev.chat_message.message_content.segment &&
                ev.self_event_state.user_id.gaia_id != ev.sender_id.gaia_id) {
                client.updatewatermark(ev.conversation_id.id, new Date());

                var message = ev.chat_message.message_content.segment.reduce(function(a, b) {
                    return {
                        text: a.text + b.text
                    };
                });

                chat.emit('message', ev, message.text);
            }
        });

        console.log('Client Initialized.');
        deferred.resolve();
    });

    return deferred.promise;
};

var send_message = function(client_id, segments, photo_id) {
    return client.sendchatmessage(client_id, segments, photo_id);
};

var upload_image = function(path, filename) {
    return client.uploadimage(path, filename, 120000);
};

var start_typing = function(ev) {
    client.setfocus(ev.conversation_id.id);
    client.settyping(ev.conversation_id.id, HangoutClient.TypingStatus.TYPING);
};

var stop_typing = function(ev) {
    client.settyping(ev.conversation_id.id, HangoutClient.TypingStatus.STOPPED);
};

module.exports = {
    chat: chat,
    connect_to_hangouts: connect_to_hangouts,
    send_message: send_message,
    upload_image: upload_image,
    start_typing: start_typing,
    stop_typing: stop_typing,
    MessageBuilder: HangoutClient.MessageBuilder
};
