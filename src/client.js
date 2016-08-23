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
    if (ev.sender_id.chat_id != CONFIG.HAMMYS_ID) {
        var message = ev.chat_message.message_content.segment.reduce(function(a, b) {
            return {
                text: a.text + b.text
            };
        });

        chat.emit('message', ev, message.text);
    }
});

module.exports = {
    chat: chat,
    MessageBuilder: Hangouts.MessageBuilder,
    send_message: function(client_id, segments, photo_id) {
        return hangouts.sendchatmessage(client_id, segments, photo_id);
    },
    upload_image: function(path, filename) {
        return hangouts.uploadimage(path, filename, 120000);
    },
    start_typing: function(ev) {
        hangouts.settyping(ev.conversation_id.id, Hangouts.TypingStatus.TYPING);
    },
    stop_typing: function(ev) {
        hangouts.settyping(ev.conversation_id.id, Hangouts.TypingStatus.STOPPED);
    }
};
