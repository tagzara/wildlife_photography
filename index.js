require('./config/database.js')().then(() => {

    const config = require('./config/config.js');
    const app = require('express')();
    const appString = `Server is started, listening on port: ${config.port}...`;

    require('./config/express.js')(app);
    require('./config/routes.js')(app);

    app.listen(config.port, console.log(appString));
});