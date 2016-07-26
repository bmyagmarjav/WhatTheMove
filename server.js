/* Author: Battulga Myagmarjav */
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use('', express.static('app'));

//eventbrite setup
var eventbrite = require('./eventbrite');
eventbrite.initiliaze('4SN5ZBRXKMLA5K424O2Z');

//socket on connetion
var countConnection = 0;
io.on('connection', function(socket) {

    //when an user sends own geographical coordinate
    socket.on('user-coordinate', function(coordinate) {
        countConnection++;
        console.log('a user connected ' + countConnection);
        eventbrite.setLocation(coordinate.lat, coordinate.lng);
        eventbrite.setCategory(eventbrite.Category().BUSINESS);
        eventbrite.getCurrentEvents(function(anEvent) {
            // console.log(e);
            io.emit('event', anEvent);
        });
    });

    //when an user disconnects ...
    socket.on('disconnect', function () {
        if (socket.connect) {
            countConnection--;
        }
        console.log('a user disconnected ' + countConnection);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
