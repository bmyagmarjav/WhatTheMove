/******************************************************************************
* Everything google map api offers implemented here for this project
*
* author: Battulga Myagmarjav
******************************************************************************/

var map, coordinate, heatmap,
    url = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
    key = '&key=AIzaSyAJ5NvGs4ZiA7SIu9WPxnP0tKYT1aHlOXo';
    categoryOn = false;

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
            placeUserMarkerAt(coordinate);
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
            
            //send the user coordinate to server
            socket.emit('user-coordinate', coordinate);

            map = setupMap(coordinate);
            placeUserMarkerAt(coordinate);
            stylizeMap();
            //drawCircle();
            makeMapResposive();
            eventsOnMap();
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

$(".cat-science a").click(function() {
    socket.emit('add-science-events');
});

$(".cat-arts a").click(function() {
    socket.emit('add-arts-events');
});

$(".cat-music a").click(function() {
    socket.emit('add-music-events');
});

$(".cat-media a").click(function() {
    socket.emit('add-media-events');
});

$(".cat-food a").click(function() {
    socket.emit('add-food-events');
});

$(".cat-causes a").click(function() {
    socket.emit('add-causes-events');
});

$(".cat-community a").click(function() {
    socket.emit('add-community-events');
});

function setupMap(coordinate) {
    return new google.maps.Map(document.getElementById('map'), {
        center: coordinate,
        zoom: 9,
        zoomControl: false,
        mapTypeControl: false,
        maxZoom: 18,
        minZoom: 9,
        //scrollwheel: false,
        //draggable: false,
        disableDoubleClickZoom: true,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        }
    });
}

function placeUserMarkerAt(coordinate) {
    return new google.maps.Marker({
        position: coordinate,
        map: map,
        icon: 'img/coolpin.png',
        animation: google.maps.Animation.BOUNCE
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

/* EVENT handlers starts here */
function eventsOnMap() {
    //receive all events currently happening
    socket.on('events', function(events) {
        var coordinates = [];
        for (var i = 0; i < events.length; i++) {
            var lat = parseFloat(events[i].location.latitude);
            var lng = parseFloat(events[i].location.longitude);
            var marker = placeEventMarkerAt({
                lat: lat,
                lng: lng
            });
            var info = events[i].info;
            insertInfoWindow(info.name, info.url, info.date, marker);
            coordinates.push({
                location: new google.maps.LatLng(lat, lng),
                weight: events[i].info.capacity
            });
        }
        console.log(coordinates);
        visualizeHeatmap(coordinates);
    });
}

function placeEventMarkerAt(coordinate) {
    return new google.maps.Marker({
        position: coordinate,
        map: map,
        icon: 'img/eventMarker.png',
        // animation: google.maps.Animation.BOUNCE
    });
}

function insertInfoWindow(name, url, date, marker) {
    var contentString =
        '<div class="infowindow">'+
            '<a class="link" href=' + url + '>' + name + '</a>' +
            '<div class="line"></div>' +
            '<p> Start : ' + date.start + '</p>' +
            '<p> End : ' + date.end + '</p>' +
        '</div>';

    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, this);
    });
}

function visualizeHeatmap(coordinates) {
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: coordinates,
		map: map,
	    gradient: getGradient(),
		radius: 20
    });
}

function getGradient() {
    return [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ];
}
