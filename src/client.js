var Hangouts = require('hangupsjs');
var events = require("events");

var CONFIG = require('./config');

var hangouts = new Hangouts();
hangouts.loglevel('error');

var credentials = function() {
    return {
        auth: Hangouts.authStdin
    };
};

hangouts.connect(credentials).then(function() {
    console.log('Successfully connected.');
    return hangouts.sendchatmessage(CONFIG.CLIENT_ID, [
        [0, 'Connected.']
    ]);
}).done();

var chat = new events.EventEmitter();
chat.setMaxListeners(50);

hangouts.on('chat_message', function(ev) {
    if (ev.self_event_state.user_id.gaia_id != ev.sender_id.gaia_id) {
        var message = ev.chat_message.message_content.segment.reduce(function(a, b) {
            return {
                text: a.text + b.text
            };
        });

        chat.emit('message', ev, message.text);
    }
});

var send_message = function(client_id, segments, photo_id) {
    return hangouts.sendchatmessage(client_id, segments, photo_id);
};

var upload_image = function(path, filename) {
    return hangouts.uploadimage(path, filename, 120000);
};

var start_typing = function(ev) {
    hangouts.settyping(ev.conversation_id.id, Hangouts.TypingStatus.TYPING);
};

var stop_typing = function(ev) {
    hangouts.settyping(ev.conversation_id.id, Hangouts.TypingStatus.STOPPED);
};

module.exports = {
    chat: chat,
    MessageBuilder: Hangouts.MessageBuilder,
    send_message: send_message,
    upload_image: upload_image,
    start_typing: start_typing,
    stop_typing: stop_typing
};
