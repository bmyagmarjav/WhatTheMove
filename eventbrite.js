/******************************************************************************
* EVENTBRITE
*
* author: Battulga Myagmarjav
******************************************************************************/
'use strict'
var exports = module.exports;
var MAX_REQUEST = 40;
var request = require('request');

var Util  = {
    BASE : 'https://www.eventbriteapi.com/v3',
    SEARCH : '/events/search',
    VENUES : '/venues/',
    WITHIN : '&location.within=50mi',
    START : '&start_date.keyword=today',
    SORT : '&sort_by=distance'
}

var url, userToken;

/* setup url with legal token */
exports.initiliaze = function(token) {
    if (token == undefined || token == "") {
        throw "Token is undefined or empty!";
    }
    userToken = token;
    url = Util.BASE + Util.SEARCH + '/?token=' + token
    url += Util.WITHIN + Util.START + Util.SORT;
}

exports.setLocation = function(latitude, longitude) {
    url += '&location.latitude=' + latitude + '&location.longitude=' +longitude;
    console.log(url);
}

exports.getCurrentEvents = function(callback) {
    request(url, function(error, response, body) {
        if (response.statusCode == 200) {
            var jsonBody = JSON.parse(body);
            var events = jsonBody.events;
            var total = events.length;
            console.log(total);
            var requestCount = 0;
            for (var i = 0; i < total; i++) {
                var current = new Date();
                var start = new Date(events[i].start.utc);
                var end = new Date(events[i].end.utc);
                var data = events[i].name.text;
                if (requestCount < MAX_REQUEST) {
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
    var url = Util.BASE+Util.VENUES+events[index].venue_id+'/?token='+userToken;3
    request(url, function(error, response, body) {
        if (response.statusCode == 200) {
            var jsonBody = JSON.parse(body);
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
