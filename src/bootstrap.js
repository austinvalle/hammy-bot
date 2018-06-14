const client = require('./client');
const message_events = require('./modules/active').message_events;

const initialize_client = () => {
	return client.connect_to_hangouts();
};

const register_events = () => {
	client.chat.on('message', async (ev, msg) => {
		for (let i = 0; i < message_events.length; i++) {
			const message_event = message_events[i];
			const matches = msg.match(message_event.regex);

			if (matches) {
				client.start_typing(ev);
				if (message_event.allow_multiple) {
					for (let m = 0; m < matches.length; m++) {
						const msg = await message_event.callback(matches[m]);
						await client.send_message(ev.conversation_id.id, msg.segments, msg.pictureId);
					}
				} else {
					const msg = await message_event.callback(matches[0]);
					await client.send_message(ev.conversation_id.id, msg.segments, msg.pictureId);
				}
				client.stop_typing(ev);
			}
		}
	});
};

module.exports = {
	initialize_client: initialize_client,
	register_events: register_events
};
