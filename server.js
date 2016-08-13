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
        sendEvents();
    });

    socket.on('add-science-events', function() {
        eventbrite.setCategory(eventbrite.Category().SCIENCE);
        sendEvents();
    });

    socket.on('add-arts-events', function() {
        eventbrite.setCategory(eventbrite.Category().ARTS);
        sendEvents();
    });

    socket.on('add-music-events', function() {
        eventbrite.setCategory(eventbrite.Category().MUSIC);
        sendEvents();
    });

    socket.on('add-media-events', function() {
        eventbrite.setCategory(eventbrite.Category().MEDIA);
        sendEvents();
    });

    socket.on('add-causes-events', function() {
        eventbrite.setCategory(eventbrite.Category().CAUSES);
        sendEvents();
    });

    socket.on('add-community-events', function() {
        eventbrite.setCategory(eventbrite.Category().COMMUNITY);
        sendEvents();
    });

    socket.on('add-food-events', function() {
        eventbrite.setCategory(eventbrite.Category().FOOD);
        sendEvents();
    });

    //when an user disconnects ...
    socket.on('disconnect', function () {
        if (socket.connect) {
            countConnection--;
        }
        console.log('a user disconnected ' + countConnection);
    });
});

function sendEvents() {
    eventbrite.getCurrentEvents(function(events) {
        // console.log(events);
        io.emit('events', events);
    });
}

http.listen(3000, function(){
    console.log('listening on *:3000');
});
