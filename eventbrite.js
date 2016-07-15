/******************************************************************************
 * EVENTBRITE
 *
 * author: Battulga Myagmarjav
 ******************************************************************************/
var request = require('request');
var exports = module.exports;

var Urls  = {
    BASE : 'https://www.eventbriteapi.com/v3',
    SEARCH : '/events/search',
    WITHIN50 : '&location.within=50mi'
}

var url;

/* setup url with legal token */
exports.initiliaze = function(token) {
    if (token == undefined || token == "") {
        throw "Token is undefined or empty!";
    }
    url = Urls.BASE+Urls.SEARCH+'/?token='+token+Urls.WITHIN50;
};

exports.setLocation = function(latitude, longitude) {
    url += '&location.latitude='+latitude+'&location.longitude='+longitude;
}

exports.getCurrentEvents = function(callback) {
    request.get(url, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var events = JSON.parse(body);
            // console.log(events);
            callback(events);
        } else {
            throw "bad request!"
        }
    });
}
