//'use strict';

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const validator = require('validator');

var MONGO_URL ="mongodb://localhost:27017/cpsc213project"//cpsc213project" process.env.MONGO_URL ||

const app = express();
mongoose.connect(MONGO_URL);
var path = require("path");


app.use(express.static('public'))
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;


const Participants = require('./models/participants.js');
const Researchers = require('./models/researchers.js');

app.use(express.static(path.join(__dirname, 'public')));

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



// app.use((req, res, next) => {
//     if (req.session.userId) {
//         Participants.findById(req.session.userId, (err, user) => {
//             if (!err) {
//                 res.locals.currentUser = user;
//             }
//             next();
//         });
//     } else {
//         next();
//     }
// });

// /**
//  * Middleware that checks if a user is logged in.
//  * If so, the request continues to be processed, otherwise a
//  * 403 is returned.
//  * @param  {Request} req - The request
//  * @param  {Response} res - sdf
//  * @param  {Function} next - sdfs
//  * @returns {undefined}
//  */
// function isLoggedIn(req, res, next) {
//     if (res.locals.currentUser) {
//         next();
//     } else {
//         res.sendStatus(403);
//     }
// }



app.get('/', function(req, res){
  res.render('index');
 //  console.log(req.body);
	// var path = require('path');
 // 	res.sendFile(path.join(__dirname+'/public/homepage.html'));
  });

  function isEmpty(str) {
      return (!str || 0 === str.length);
  }

app.post('/participant-registration', (req, res) => {

    console.log(req.body);

    if(isEmpty(req.body.username) || isEmpty(req.body.password) || isEmpty(req.body.email) || isEmpty(req.body.passwordConfirm)){
      var err1 = ['Username, Password, and Email must not be empty'];
      return res.render('participant-register', {errors: err1});
    }

    if(req.body.password !== req.body.passwordConfirm){
  var err2 = ['Passwords dont match'];
  return res.render('participant-register', {errors: err2});
}



    const newParticipant = new Participants();
    newParticipant.email = req.body.email;
    newParticipant.username = req.body.username;
    newParticipant.hashed_password = req.body.password;

    console.log(newParticipant);


        newParticipant.save(function(err, user) {
          if(err){
            return res.redirect('/');
          }
          else{
            req.session.userId = user._id;
            return res.redirect('/');
          }

        });

    });



app.post('/researcher-registration', (req, res) => {

   console.log(isEmpty(req.body.institution));
   console.log(isEmpty(req.body.passwordConfirm));

    console.log(req.body.institution);
    console.log(req.body.passwordConfirm);



    if(isEmpty(req.body.username) || isEmpty(req.body.institution) || isEmpty(req.body.password) || isEmpty(req.body.email) || isEmpty(req.body.passwordConfirm)){
      var err5 = ['Username, Institution, Password, and Email must not be empty'];
      return res.render('research-register', {errors: err5});
    }

    if(req.body.password !== req.body.passwordConfirm){
  var err6 = ['Passwords dont match'];
  return res.render('research-register', {errors: err6});
}



    const newResearcher = new Researchers();
    newResearcher.email = req.body.email;
    newResearcher.username = req.body.username;
    newResearcher.hashed_password = req.body.password;
    newResearcher.institution = req.body.institution;



    newResearcher.save(function(err, user) {
      if(err){
        return res.redirect('/');
      }
      else{
        req.session.userId = user._id;
        return res.redirect('/');
      }

    });

});



app.get('/signout', (req, res) => {
    res.locals.currentUser = null;
    req.session.destroy();
    return res.redirect('/');
});

app.post('/participantlogin', (req, res) => {

      console.log(req.body);


  var username = req.body.participantName;
  var password = req.body.participantPassword;

   Participants.findOne({username: username}, function(err, user) {
      if(err) return next(err);
      if(!user){
        var noUser = ['No such user'];
        return res.render('index', {errors: noUser});
      }

      user.comparePassword(password, (err2, match) => {

        if(err2 || !match){
          var wrongPass = ['Invalid Password'];
          return res.render('index', {errors: wrongPass});
        }

        else{
          req.session.user = user;
          req.session.userId = user._id;
          res.locals.currentUser = user;
          return res.redirect('/');
        }

      });
  });
});


app.listen(port, () => {
    console.log(`Now running on port ${port}`);
});
