function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.674, lng: -73.945 },
        zoom: 12,
    });

    // You can change the iconbase
    var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
    var icons = {
        occupied: {
            name: 'Occupied',
            icon: iconBase + 'parking_lot_maps.png'
        },
        unoccupied: {
            name: 'Unoccupied',
            icon: iconBase + 'library_maps.png'
        },
    };

    // The purpose for this is to determine where the points are.
    var features = [];

    // For every point that you want to add, add the points.

    addPoint(40.674, -73.945);
    regeneratePoints();

    function addPoint(position1, position2, taken = false) {
        if (taken) {
            features.push({
                position: new google.maps.LatLng(position1, position2),
                type: 'occupied'
            })
        } else {
            features.push({
                position: new google.maps.LatLng(position1, position2),
                type: 'unoccupied'
            })
        }
    }

    function removePoint(marker) {
        marker.setMap(null)
    }

    function regeneratePoints() {
        features.forEach(function (feature) {
            markerCreate(feature);
        });
    }

    function markerCreate(feature) {
        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
            '<div id="bodyContent">' +
            '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
            'sandstone rock formation in the southern part of the ' +
            'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
            'south west of the nearest large town, Alice Springs; 450&#160;km ' +
            '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
            'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
            'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
            'Aboriginal people of the area. It has many springs, waterholes, ' +
            'rock caves and ancient paintings. Uluru is listed as a World ' +
            'Heritage Site.</p>' +
            '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
            'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
            '(last visited June 22, 2009).</p>' +
            '</div>' +
            '</div>';

        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        var marker = new google.maps.Marker({
            position: feature.position,
            icon: icons[feature.type].icon,
            map: map
        });

        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
    }
}