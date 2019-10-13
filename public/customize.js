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
            var marker = new google.maps.Marker({
                position: feature.position,
                icon: icons[feature.type].icon,
                map: map
            });
        });
    }
}