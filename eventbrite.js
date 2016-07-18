/******************************************************************************
* EVENTBRITE
*
* author: Battulga Myagmarjav
******************************************************************************/
'use strict'
var request = require('request');
var exports = module.exports;

var Utils  = {
    BASE : 'https://www.eventbriteapi.com/v3',
    SEARCH : '/events/search',
    VENUES : '/venues/',
    WITHIN : '&location.within=50mi',
    START: '&start_date.keyword=today'
}

var url, userToken;

/* setup url with legal token */
exports.initiliaze = function(token) {
    if (token == undefined || token == "") {
        throw "Token is undefined or empty!";
    }
    userToken = token;
    url = Utils.BASE+Utils.SEARCH+'/?token='+token+Utils.WITHIN+Utils.START;
}

exports.setLocation = function(latitude, longitude) {
    url += '&location.latitude='+latitude+'&location.longitude='+longitude;
    console.log(url);
}

exports.getCurrentEvents = function(callback) {
    request.get(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonBody = JSON.parse(body);
            var events = jsonBody.events;
            var total = events.length;
            for (var i = 0; i < total; i++) {
                getEventWithLocation(events, i, function(event) {
                    callback(event);
                });
            }
        } else {
            throw "Bad request"
        }
    });
}

function getEventWithLocation(events, index, callback) {
    var u = Utils.BASE+Utils.VENUES+events[index].venue_id+'/?token='+userToken;
    request.get(u, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonBody = JSON.parse(body);
            callback({
                name : events[index].name.text,
                description : events[index].description.text,
                startDate : events[index].start.local,
                endDate : events[index].end.local,
                location : {
                    latitude : jsonBody.latitude,
                    longitude : jsonBody.longitude
                }
            });
        } else {
            throw "Bad request!"
        }
    });
}
