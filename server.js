/* Author: Battulga Myagmarjav */

// i:  require
var express = require("express");
var path = require('path');

// ii: express
var app = express();
var port = 54321;
var hostname = 'localhost';

app.get('', function(req, res) {
    res.sendFile(path.join(__dirname + '/app/index.html'));
});

var TOKEN = '4SN5ZBRXKMLA5K424O2Z'
var eventbrite = require('./eventbrite');
eventbrite.initiliaze(TOKEN);
eventbrite.setLocation('41.787650', '-88.157957');
eventbrite.getCurrentEvents(function(e) {
    console.log(e);
});

// app start running
app.listen(port, hostname, function() {
    console.log(process.env.PWD);
    console.log("What's The Move - start : %s:%s", hostname, port);
});
