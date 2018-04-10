const express = require('express')
const app = express()

// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

server.use('/public', express.static(__dirname + '/public'));

server.get('/*', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

/*
app.get('/', function(req, res){
     res.sendFile(path.join(__dirname+'/public/index.html'));
 }); */

app.listen(port, () => {
    console.log(`Now running on port ${port}`);
})