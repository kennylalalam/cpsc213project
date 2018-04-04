const express = require('express')
const app = express()
const exphbs = require('express-handlebars');
// Use the built in node path library
const path = require('path');
const config = require('./config.js');

// Import our controllers
const controllers = require('./controllers/index.js');

// Get our database object. See https://github.com/vitaly-t/pg-promise
const db = require('./db.js')(config.databaseURL);

// Configure the template/view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');


app.get('/', controllers.index);

app.get('/form', controllers.form);

app.get('/database', controllers.database);

app.get('/api', controllers.api);



app.listen(config.port, () => {
    console.log(`Now running on http://localhost:${config.port}`);
    // Once it is started, establish the database connection
    // db.connect()
    //     .then(() => {
    //         // Tell the controllers to use this database connection
    //         // See https://stackoverflow.com/questions/22586542/using-global-variables-in-express-node
    //         app.set('db', db);
    //     })
    //     .catch((error) => {
    //         // Exit program if we cannot connect
    //         console.log(`Error connecting to database ${error.message}`);
    //         process.exit();
    //     });
});
