/******************************************************************************
* EVENTBRITE
*
* author: Battulga Myagmarjav
******************************************************************************/
'use strict'
var unirest = require('unirest');
var exports = module.exports;

var Util  = {
    BASE : 'https://www.eventbriteapi.com/v3',
    SEARCH : '/events/search',
    VENUES : '/venues/',
    WITHIN : '&location.within=50mi',
    START : '&start_date.keyword=today'
}

var url, userToken;

/* setup url with legal token */
exports.initiliaze = function(token) {
    if (token == undefined || token == "") {
        throw "Token is undefined or empty!";
    }
    userToken = token;
    url = Util.BASE+Util.SEARCH+'/?token='+token+Util.WITHIN+Util.START;
}

exports.setLocation = function(latitude, longitude) {
    url += '&location.latitude='+latitude+'&location.longitude='+longitude;
    console.log(url);
}

exports.getCurrentEvents = function(callback) {
    unirest.get(url).end(function(response) {
        if (response.statusCode == 200) {
            var events = response.body.events;
            var total = response.body.events.length;
            console.log(total);
            var requestCount = 0;
            for (var i = 0; i < total; i++) {
                var current = new Date();
                var start = new Date(events[i].start.utc);
                var end = new Date(events[i].end.utc);
                if (start < current && current < end && requestCount < 40) {
                    var data = events[i].name.text;
                    getEventWithCoordinate(events, i, data, function(e) {
                        callback(e);
                    });
                    requestCount++;
                }
            }
        } else {
            throw "Bad request";
        }
    });
}

function getEventWithCoordinate(events, index, data, callback) {
    var url = Util.BASE+Util.VENUES+events[index].venue_id+'/?token='+userToken;
    unirest.get(url).end(function(response) {
        if (response.statusCode == 200) {
            var jsonBody = response.body;
            callback({
                name : data,
                location : {
                    address : jsonBody.address.localized_address_display,
                    latitude : jsonBody.latitude,
                    longitude : jsonBody.longitude
                }
            });
        }
    });
}
