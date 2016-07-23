/* Author: Battulga Myagmarjav */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('', express.static('app'));

io.on('connection', function(socket){
  console.log('a user connected');
});

var TOKEN = '4SN5ZBRXKMLA5K424O2Z'
var eventbrite = require('./eventbrite');
eventbrite.initiliaze(TOKEN);
eventbrite.setLocation('41.787650', '-88.157957');
eventbrite.getCurrentEvents(function(e) {
    console.log(e);
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
