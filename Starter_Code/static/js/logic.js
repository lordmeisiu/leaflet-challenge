// Map Object
var myMap = L.map("map", {
    center: [39.8283, -98.5795], 
    zoom: 5
});

// Tile Layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
}).addTo(myMap);

// Earthquake data link
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Function to size the circle by magnitude
function sizeCircle(magnitude) {
    return magnitude * 4;
};

// Function to color the circle by depth
function colorCircle(depth) {
    if (depth >= 90) {
        color = "#671c15";
    }
    else if (depth < 90 && depth >= 70) {
        color = "#bd0026";
    }
    else if (depth < 70 && depth >= 50) {
        color = "#f03b20";
    }
    else if (depth < 50 && depth >= 30) {
        color = "#fd8d3c";
    }
    else if (depth < 30 && depth >= 10) {
        color = "#feb24c";
    }
    else if (depth < 10 && depth >= -10) {
        color = "#2ca128";
    };

    return color;
};

// Access data from link
d3.json(url).then(data => {
    console.log(data);

    // Create a cluster group
    var features = data.features;
    var d_array = [];

    // Loop through data
    for (var i = 0; i < features.length; i++) {
        // Define variables from earthquake data
        var coordinates = features[i].geometry.coordinates;
        var latitude = coordinates[1];
        var longitude = coordinates[0];

        // Define depth & push to an array
        var depth = coordinates[2];
        d_array.push(depth);

        var properties = features[i].properties;

        // Define place & magnitude
        var place = properties.place;
        var magnitude = properties.mag;

    

        // Create markers
        circles = L.circleMarker([latitude, longitude], {
            color: "black",
            weight: 1,
            fillColor: colorCircle(depth),
            opactiy: 1,
            fillOpacity: 1,
            radius: sizeCircle(magnitude)
        }).bindPopup(`<h3>${place}</h3><br/>Magnitude: ${magnitude}<br/>Depth: ${depth}`).addTo(myMap);

        // console.log(coordinates);

    };

    // Create info title
    var info = L.control({position: "topleft"});

    // Define function when info is added
    info.onAdd = function() {
        var div = L.DomUtil.create("div", "info");
        var title = "<h1>All earthquakes in the last 30 days </h1>"
        div.innerHTML = title;

        return div
    };

    // Create Legend
    var legend = L.control({ position: "bottomright" });

    // Define function when legend is added
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        var limits = [-10, 10, 30, 50, 70, 90];
        var title = "<h2>Depth in km</h2>"

        // Add title to div
        div.innerHTML = title;

        // Loop through limits, and create a new legend line
        for (var i = 0; i < limits.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colorCircle(limits[i] + 1) + '"></i> ' +
                limits[i] + (limits[i + 1] ? '&ndash;' + limits[i + 1] + '<br>' : '+');
        }

        return div;
    };

    // Add the legend & the info title to the map
    legend.addTo(myMap);
    info.addTo(myMap);
})