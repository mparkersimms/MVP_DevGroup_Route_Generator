function initMap() {
    $.ajax('/route').then(stuffThatComesBack => {

        const directionsService = new google.maps.DirectionsService();
        const directionsRenderer = new google.maps.DirectionsRenderer();
        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 7,
            center: { lat: 41.85, lng: -87.65 },
        });
        directionsRenderer.setMap(map);


        calculateAndDisplayRoute(directionsService, directionsRenderer);


        const polyCoords = polyPoints(stuffThatComesBack[0]);
        const polyBound = new google.maps.Polygon({
            paths: polyCoords,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
        });
        polyBound.setMap(map);

        const service = new google.maps.places.PlacesService(map);

        for (let i = 0; i < stuffThatComesBack[0].length; i += 30) {

            service.nearbySearch({
                location: { lat: stuffThatComesBack[0][i][0], lng: stuffThatComesBack[0][i][1] },
                radius: '30000',
                keyword: [stuffThatComesBack[1].category]
            }, callback);
        }
        function callback(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (var i = 0; i < results.length; i++) {
                    console.log(i);
                    if (google.maps.geometry.poly.containsLocation(results[i].geometry.location, polyBound) == true) {
                        new google.maps.Marker({
                            position: results[i].geometry.location,
                            map,
                            title: "Hello World!"
                        });
                        $('#list ul').append(`<section></section>`);
                        $('#list ul section:last-child').append(`<li>${results[i].name}</li>`);
                        $('#list ul section:last-child').append(`<li>${results[i].vicinity}</li>`);
                        $('#list ul section:last-child').append(`<li>${results[i].photos[0].html_attributions[0]}</li>`);
                    }
                }
            }
        }
    });
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    $.ajax('/locations').then(locationData => {

        directionsService.route(
            {
                origin: {
                    query: locationData[0].origin,
                },
                destination: {
                    query: locationData[0].desination,
                },
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
                if (status === "OK") {
                    directionsRenderer.setDirections(response);
                    console.log(response);
    
                } else {
                    window.alert("Directions request failed due to " + status);
                }
            }
        );
    });

}


function polyArray(latitude) {
    const R = 6378137;
    const pi = 3.14;
    //distance in meters
    const upper_offset = 5000;
    const lower_offset = -5000;
    const lat_up = upper_offset / R;
    const lat_down = lower_offset / R;
    //OffsetPosition, decimal degrees
    const lat_upper = latitude + (lat_up * 180) / pi;
    const lat_lower = latitude + (lat_down * 180) / pi;
    // console.log(lat_lower);
    return [lat_upper, lat_lower];
}


function polyPoints(arr) {
    let upperBound = [];
    let lowerBound = [];
    for (let i = 0; i <= arr.length - 1; i++) {
        let newPoints = polyArray(arr[i][0]);
        upperBound.push({ lat: newPoints[0], lng: arr[i][1] });
        lowerBound.push({ lat: newPoints[1], lng: arr[i][1] });
    }
    let reversebound = lowerBound.reverse();
    let fullPoly = upperBound.concat(reversebound);
    return fullPoly;
}


$('svg').on('click', displayNavBar);

function displayNavBar(){
    $('#nav').toggle();
}

