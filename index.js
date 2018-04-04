const express = require('express')
const app = express()

// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => {
    console.log(`Now running on port ${port}`);
})