const client = require('./client');
const message_events = require('./modules/active').message_events;

const initialize_client = () => {
	return client.connect_to_hangouts();
};

const register_events = () => {
	client.chat.on('message', (ev, msg) => {
		for (let i = 0; i < message_events.length; i++) {
			const message_event = message_events[i];
			const matches = msg.match(message_event.regex);

			if (matches) {
				client.start_typing(ev);
				if (message_event.allow_multiple) {
					for (let m = 0; m < matches.length; m++) {
						message_event.callback(matches[m]).then((msg) => {
							return client.send_message(ev.conversation_id.id, msg.segments, msg.pictureId);
						}).then(() => {
							client.stop_typing(ev);
						});
					}
				} else {
					message_event.callback(matches[0]).then((msg) => {
						return client.send_message(ev.conversation_id.id, msg.segments, msg.pictureId);
					}).then(() => {
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
