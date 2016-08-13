/******************************************************************************
* EVENTBRITE
*
* author: Battulga Myagmarjav
******************************************************************************/
'use strict'
var exports = module.exports;
var MAX_REQUEST = 40;
var request = require('request');
var async = require('async');

var Util  = {
    BASE : 'https://www.eventbriteapi.com/v3',
    SEARCH : '/events/search',
    VENUES : '/venues/',
    WITHIN : '&location.within=50mi',
    START : '&start_date.keyword=today',
    SORT : '&sort_by=best'
}

var url, locUrl, categoryUrl,
userToken,
isCategory = false;

exports.Category = function() {
    return {
        BUSINESS : 101,
        SCIENCE : 102,
        MUSIC : 103,
        MEDIA : 104,
        ARTS : 105,
        // FASHION : 106,
        // HEALTH : 107,
        // SPORTS : 108,
        // OUTDOOR : 109,
        FOOD : 110,
        CAUSES : 111,
        // GOV : 112,
        COMMUNITY : 113,
        // RELIGION : 114,
        // EDUCATION : 115,
        // HOLIDAY : 116,
        // HOME : 117
    };
}

/* setup url with legal token */
exports.initiliaze = function(token) {
    if (token == undefined || token == "") {
        throw "Token is undefined or empty!";
    }
    userToken = token;
    url = Util.BASE + Util.SEARCH + '/?token=' + token
    url += Util.WITHIN + Util.START + Util.SORT;
}

exports.setLocation = function(lat, lng) {
    locUrl = url + '&location.latitude=' + lat + '&location.longitude=' + lng;
    isCategory = false;
}

exports.setCategory = function(id) {
    categoryUrl = locUrl + '&categories=' + id;
    isCategory = true;
}

var getUrl = function() {
    if (isCategory) {
        return categoryUrl;
    }
    return locUrl;
}

exports.getCurrentEvents = function(callback) {
    console.log(getUrl());
    request(getUrl(), function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonBody = JSON.parse(body);
            var events = jsonBody.events;
            var total = events.length;
            console.log("total event on this page: " + total);
            var requestCount = 0;

            var collection = [];

            for (var i = 0; i < total; i++) {
                var current = new Date();
                var event = events[i];
                var start = new Date(event.start.utc);
                var end = new Date(event.end.utc);
                var data = {
                    name : event.name.text,
                    description : event.description.text,
                    capacity : event.capacity,
                    url : event.url,
                    date : {
                        start : start.toLocaleString(),
                        end : end.toLocaleString()
                    }
                }

                if (requestCount < MAX_REQUEST) {
                    collection.push({
                        url : Util.BASE+Util.VENUES+event.venue_id+'/?token='+userToken,
                        data : data
                    });
                    requestCount++;
                }
            }

            getEventWithCoordinate(collection, function(all) {
                callback(all);
            });
        } else {
            throw error;
        }
    });
}

function getEventWithCoordinate(events, callback) {
    console.log(events.length);
    async.map(events, function(event, callback) {
        request(event.url, function(error, response, body) {
            // Some processing is happening here before the callback is invoked
            var jsonBody = JSON.parse(body);
            callback(error, {
                info : event.data,
                location : {
                    address : jsonBody.address.localized_address_display,
                    latitude : jsonBody.latitude,
                    longitude : jsonBody.longitude
                }
            });
        });
    }, function(error, coordinatedEvents) {
        callback(coordinatedEvents);
    });
}
