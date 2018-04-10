const express = require('express')
const app = express()

app.use(express.static('public'))
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

//app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	var path = require('path');
  	res.sendFile(path.join(__dirname+'/public/index.html'));
 }); 

app.listen(port, () => {
    console.log(`Now running on port ${port}`);
})