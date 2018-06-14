var bootstrap = require('./bootstrap');

bootstrap.initialize_client()
    .then(bootstrap.register_events);

process.on('uncaughtException', function(err) {
    console.log(err)
});
