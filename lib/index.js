var bootstrap = require('./bootstrap');

bootstrap.initialize_client()
    .then(bootstrap.register_modules);
