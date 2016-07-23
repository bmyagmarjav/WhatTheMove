/* Author: Battulga Myagmarjav */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('', express.static('app'));

//eventbrite setup
var TOKEN = '4SN5ZBRXKMLA5K424O2Z'
var eventbrite = require('./eventbrite');
eventbrite.initiliaze(TOKEN);

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('user-coordinate', function(coordinate){
        eventbrite.setLocation(coordinate.lat, coordinate.lng);
        eventbrite.getCurrentEvents(function(e) {
            // console.log(e);
            io.emit('event', e);
        });
    });
});






http.listen(3000, function(){
    console.log('listening on *:3000');
});
