/* Author: bmyagmarjav */

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

// app start running
app.listen(port, hostname, function() {
  console.log("What's The Move - start : %s:%s", hostname, port);
});
