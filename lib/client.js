var events = require("events");
var MessageBuilder = require('hangupsjs').MessageBuilder;

var Q = require('q');

var chat = new events.EventEmitter();

chat.setMaxListeners(50);

var init = function(hangoutsClient) {
    var deferred = Q.defer();
    client = hangoutsClient;

    client.on('chat_message', function(ev) {
        if (ev.self_event_state.user_id.gaia_id != ev.sender_id.gaia_id) {
            var message = ev.chat_message.message_content.segment.reduce(function(a, b) {
                return {
                    text: a.text + b.text
                };
            });

            chat.emit('message', ev, message.text);
        }
    });

    deferred.resolve(client);

    return deferred.promise;
};

var send_message = function(client_id, segments, photo_id) {
    return client.sendchatmessage(client_id, segments, photo_id);
};

var upload_image = function(path, filename) {
    return client.uploadimage(path, filename, 120000);
};

var start_typing = function(ev) {
    client.settyping(ev.conversation_id.id, client.TypingStatus.TYPING);
};

var stop_typing = function(ev) {
    client.settyping(ev.conversation_id.id, client.TypingStatus.STOPPED);
};

module.exports = {
    chat: chat,
    init: init,
    send_message: send_message,
    upload_image: upload_image,
    start_typing: start_typing,
    stop_typing: stop_typing,
    MessageBuilder: MessageBuilder
};
