const PrettyError = require('pretty-error');

const bootstrap = require('./bootstrap');

const initializeApp = async () => {
	await bootstrap.initialize_client();
	bootstrap.register_events();
};

process.on('uncaughtException', (err) => {
	const pe = new PrettyError();
	const renderedError = pe.render(err);

	console.log(renderedError);
});

initializeApp();
