/**
 * author: Battulga Myagamrjav
 */

var map, coordinate,
    url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    key = '&key=AIzaSyAJ5NvGs4ZiA7SIu9WPxnP0tKYT1aHlOXo';

var socket = io();

function initMap() {
    //geolocation to get current lt and lg for a user
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            coordinate = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            //send the user coordinate to server
            socket.emit('user-coordinate', coordinate);

            map = setupMap(coordinate);
            userCoordinateMarker(coordinate);
            stylizeMap();
            //drawCircle();
            makeMapResposive();
            eventsOnMap();
        }, function() {
            handleLocationError(true);
        });
    } else {
        //Browser doesn't support Geolocation
        handleLocationError(false);
    }
}

$('#search').submit(function(event) {
    var requestUlr = url + $('#address').val() + key;
    $.getJSON(requestUlr, function(data) {
        if (data.status === 'OK') {
            coordinate = data.results[0].geometry.location
            map = setupMap(coordinate);
            currentCoordinateMarker(coordinate);
            stylizeMap();
            addDatalistToInput(data);
        } else {
            console.log(data.status);
        }
    });

    // if(event.keyCode === 8) {
    //     $('#browsers').empty();
    // }
    $('#browsers').empty();
    event.preventDefault();
});

function setupMap(coordinate) {
    return new google.maps.Map(document.getElementById('map'), {
        center: coordinate,
        zoom: 11,
        zoomControl: false,
        mapTypeControl: false,
        maxZoom: 16,
        minZoom: 11,
        //scrollwheel: false,
        //draggable: false,
        disableDoubleClickZoom: true,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
    });
}

function userCoordinateMarker(coordinate) {
    return new google.maps.Marker({
        position: coordinate,
        map: map,
        icon: 'img/coolpin.png',
        // animation: google.maps.Animation.BOUNCE
    });
}

function eventCoordinateMarker(coordinate) {
    return new google.maps.Marker({
        position: coordinate,
        map: map,
        icon: 'img/coolpin.png',
        // animation: google.maps.Animation.BOUNCE
    });
}

function stylizeMap() {
    var url = getStyleUrl();
    $.getJSON(url, function(data) {
        var style = new google.maps.StyledMapType(data, {name: "Styled Map"});
        map.mapTypes.set('map_style', style);
        map.setMapTypeId('map_style');
    });
}

function getStyleUrl() {
    var hours = (new Date()).getHours();
    if (hours > 6 && hours < 19) {
        return "json/day-style.json";
    }
    return "json/night-style.json";
}

// this is not used ~ future reference
function drawCircle() {
    return new google.maps.Circle({
        strokeColor: '#5C5EDC',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#444444',
        fillOpacity: 0.05,
        map: map,
        center: map.getCenter(),
        radius: 8000 //Math.sqrt(citymap[city].population) * 100
    });
}

function addDatalistToInput(data) {
    var length = data.results.length;
    for (var i = 0; i < length; i++) {
        $('#browsers').append(
            '<option value="' + data.results[i].formatted_address + '">'
        );
    }
}

function makeMapResposive() {
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });
}

function handleLocationError(browserHasGeolocation) {
	console.log(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

function eventsOnMap() {
    //receive all events currently happenning
    socket.on('event', function(event) {
        eventCoordinateMarker({
            lat: parseFloat(event.location.latitude),
            lng: parseFloat(event.location.longitude)
        });
    });
}
