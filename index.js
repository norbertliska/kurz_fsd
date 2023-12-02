require('dotenv').config()
const express = require('express') 
const app = express() 
    app.get('/', function (req, res) { 
    res.send('Hello World! ' + (new Date()) ) 
}) 
app.listen(process.env.PORT, process.env.HOST)

