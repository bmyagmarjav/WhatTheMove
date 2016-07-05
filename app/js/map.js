/**
 * author: Battulga Myagamrjav
 */

var map;

function initMap() {
    //geolocation to get current lt and lg for a user
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            //setup the map
            map = setupMap(position.coords.latitude, position.coords.longitude);
            map.setCenter(pos);

            //setup current location marker
            var currenPositionMarker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: 'img/coolpin.png',
                // animation: google.maps.Animation.BOUNCE
            });

            //style the map
            setupStyle();
            //draw circle
            drawCircle();
        }, function() {
            handleLocationError(true);
        });
    } else {
        //Browser doesn't support Geolocation
        handleLocationError(false);
    }
}

function setupMap(latitude, longitude) {
    return new google.maps.Map(document.getElementById('map'), {
        center: {lat: latitude, lng: longitude},
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

function setupStyle() {
    var url = getStyleUrl();
    $.getJSON(url, function(data) {
        var style = new google.maps.StyledMapType(data, {name: "Styled Map"});
        map.mapTypes.set('map_style', style);
        map.setMapTypeId('map_style');
    });
}

function getStyleUrl() {
    var hours = (new Date()).getHours();
    console.log(hours);
    if (hours > 6 && hours < 19) {
        return "json/day-style.json";
    }
    return "json/night-style.json";
}

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

function handleLocationError(browserHasGeolocation) {
	console.log(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}
