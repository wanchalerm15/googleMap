// var apiKey = 'AIzaSyC9PnuRk42kbCPMOvsfHpn40r5SoyN38zI';

// initialize google map
function initialzeMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17,
        center: { lat: 15.263351, lng: 104.838714 }
    });

    var latLngs = [];
    map.addListener('click', function (event) {
        var lat = event.latLng.lat();
        var lng = event.latLng.lng();
        latLngs.push({ lat: lat, lng: lng });
        markerMap(event.latLng, map);
        addressMap(event.latLng, function (address) {
            distanceMatrixMap(latLngs, function (result) {
                console.log(result, address);
            });
        });
    });
}

// marker pin
function markerMap(latLng, map) {
    return new google.maps.Marker({ position: latLng, map: map });
}

// get address info
function addressMap(latLng, callback) {
    var address = [];
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                results[0].address_components.forEach(function (component) {
                    address.push(component.long_name);
                });
                if (callback) callback(address.join(' '));
            }
            else alert('No results found');
        }
        else alert('Geocoder failed due to: ' + status);
    });
}

// get kilometer between route a - b
function distanceMatrixMap(latLngs, callback) {
    if (latLngs.length != 2) return;

    var latFrom = latLngs[0].lat,
        lngFrom = latLngs[0].lng,
        latTo = latLngs[1].lat,
        lngTo = latLngs[1].lng;

    var distance = new google.maps.DistanceMatrixService();
    var origin = new google.maps.LatLng(latFrom, lngFrom);
    var destination = new google.maps.LatLng(latTo, lngTo);

    distance.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
        // unitSystem: google.maps.UnitSystem.IMPERIAL
    }, function (results, status) {
        if (status === 'OK') {
            try {
                if (!callback) return;
                callback(results.rows[0].elements[0]);
            }
            catch (ex) { alert(ex); }
        }
        else alert('DistanceMatrixService failed due to: ' + status);
    });
}