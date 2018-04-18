const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const validator = require('validator');

const app = express();

var MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/cpsc213project"
mongoose.connect(process.env.MONGO_URL);
var path = require("path");

app.use(express.static('public'))
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;


const Participants = require('./models/participants.js');
const Researchers = require('./models/researchers.js');

//app.use(express.static(path.join(__dirname, 'public')));

const store = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: 'sessions',
});
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

// For parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true,
}));

// Configure session middleware that will parse the cookies
// of an incoming request to see if there is a session for this cookie.
app.use(session({
    secret: process.env.SESSION_SECRET || 'G8XqIDs5m20LRMkzExM/adYo5Zvfbl/cg5AAfqaMTr0=',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: 'auto',
    },
    store,
}));




app.get('/', function(req, res) => {
  res.render('index');
	//var path = require('path');
//  	res.sendFile(path.join(__dirname+'/public/index.html'));
 });

 app.get('/login', function(req, res) => {
   res.render('login');
  });

  app.post('/participant/registration', function(req, res) => {

    var newParticpant = new Participants();
    newParticipant.email = req.body.email;
    newParticipant.name = req.body.name;
    newParticipant.hashed_password = req.body.password;

newParticipant.save(function(err, user) {
  if(err){
    err = ['Error registering you!'];
    res.render('index');
  }
  else{
    req.session.userId = user._id;
    return res.redirect('/');
  }


});

});
   });

app.listen(port, () => {
    console.log(`Now running on port ${port}`);
})
