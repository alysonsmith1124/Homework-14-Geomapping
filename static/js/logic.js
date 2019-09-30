function createMap(earthquakes){

    //Create tile layer
    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.light",
        accessToken: API_KEY
    });

    //Create baseMaps object
    var baseMaps = {"Light Map": lightmap};

    //Create overlayMaps object
    var overlayMaps = {"Earthquakes": earthquakes};

    //Create map object
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 4,
        layers: [lightmap, earthquakes]
    });

    //Create layer control
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    //Create legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function(){
        var div = L.DomUtil.create("div", "info legend"),
            colors = ["#26D546", "#AFE82D", "#E1ED26", "#EAB423", "#E77A24", "#EC5427"],
            mags = [0,1,2,3,4,5];

        for (var index = 0; index < mags.length; index++) {
            div.innerHTML += '<i style="background:' + colors[index] + '"></i>' +
            mags[index] + (mags[index+1] ? "&ndash;" + mags[index+1] + "<br>" : "+");
        }
        return div;
    };
    legend.addTo(myMap);

}

function chooseColor(magnitude) {
    switch (true) {
        case magnitude < 1:
            return "#26D546";
        case magnitude < 2:
            return "#AFE82D";
        case magnitude < 3:
            return "#E1ED26";
        case magnitude < 4:
            return "#EAB423";
        case magnitude < 5:
            return "#E77A24";
        default:
            return "#EC5427";
    }
}

function createMarkers(response){

    //Set variable to feature location
    var features = response.features;

    //Create array to hold markers
    var markers = [];

    //Loop through earthquakes
    for (var index = 0; index < features.length; index++) {
        var feature = features[index];

            var marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
                fillColor: chooseColor(feature.properties.mag),
                color: "#000000",
                radius: (feature.properties.mag + 1) * 3.5,
                fillOpacity: .5,
                opacity: .5,
                stroke: true,
                weight: 1
            }).bindPopup("<h3>Magnitude: " + feature.properties.mag + "</h3><h3>Location: " + feature.properties.place + "</h3>");
            markers.push(marker);
    }
    
    createMap(L.layerGroup(markers));

}

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
