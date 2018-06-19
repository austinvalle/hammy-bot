const bootstrap = require('./bootstrap');

const initializeApp = async () => {
	await bootstrap.initialize_client();
	bootstrap.register_events();
};

process.on('uncaughtException', (err) => {
	console.log(err);
});

initializeApp();
