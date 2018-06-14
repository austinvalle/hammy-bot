const HangoutClient = require('hangupsjs');
const Q = require('q');
const events = require('events');

const fs = require('fs-extra');
const FileCookieStore = require('tough-cookie-filestore');
const cookiesPath = require('path').join(__dirname, '../cookies.json');

if (process.env.COOKIES_JSON) {
	console.log('ENV VARIABLE DETECTED!');
	fs.outputFileSync('cookies.json', process.env.COOKIES_JSON);
}

const client = new HangoutClient({
	jarstore: fs.pathExistsSync(cookiesPath) ? new FileCookieStore(cookiesPath) : null
});

const chat = new events.EventEmitter();

chat.setMaxListeners(50);

const connect_to_hangouts = async () => {
	const deferred = Q.defer();

	client.loglevel('error');

	const credentials = () => {
		return {
			auth: HangoutClient.authStdin
		};
	};

	await client.connect(credentials);

	client.on('chat_message', (ev) => {
		if (ev.chat_message.message_content.segment &&
			ev.self_event_state.user_id.gaia_id != ev.sender_id.gaia_id) {
			client.updatewatermark(ev.conversation_id.id, new Date());

			const message = ev.chat_message.message_content.segment.reduce((a, b) => {
				return {
					text: a.text + b.text
				};
			});

			chat.emit('message', ev, message.text);
		}
	});

	console.log('Client Initialized.');
	deferred.resolve();

	return deferred.promise;
};

const send_message = (client_id, segments, photo_id) => {
	return client.sendchatmessage(client_id, segments, photo_id);
};

const upload_image = (path, filename) => {
	return client.uploadimage(path, filename, 120000);
};

const start_typing = (ev) => {
	client.setfocus(ev.conversation_id.id);
	client.settyping(ev.conversation_id.id, HangoutClient.TypingStatus.TYPING);
};

const stop_typing = (ev) => {
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
