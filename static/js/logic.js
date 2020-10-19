// Create map
var myMap = L.map("mapid", {
    center: [37.09, -95.71],
      zoom: 5
    });

// Adding tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

// API call to get geo json data on earthquakes
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson").then(createMarkers);

// function to create markers
function createMarkers(response) {
    
    // console the response 
    console.log(response.features);
    
    // loop through earthquakes and create markers
    for (var i = 0; i < response.features.length; i++) {

        // conditionals for color of circle based on depth
        var color = "";
        var depth = response.features[i].geometry.coordinates[2];
        if (depth < 5) {
            color = "blue";
        }

        else if (depth < 10) {
            color = "yellow";
        }

        else if (depth < 20) {
            color = "pink";
        }

        else {
            color = "red";
        }

        // Add circles to the map
        var mag = response.features[i].properties.mag;
        var lat = response.features[i].geometry.coordinates[1];
        var lon = response.features[i].geometry.coordinates[0];
        var place = response.features[i].properties.place;
        
        L.circle([lat, lon], {
            fillOpacity: 0.75,
            color: "black",
            fillColor: color,
            radius: mag * 25000
        }).bindPopup("<h3>" + place + "</h3><h3>Magnitude: " + mag + "</h3>")
            .addTo(myMap);

    }

    // add legend

    function getColor(d) {
        return  d < 5 ? "blue":
                d < 10 ? "yellow":
                d < 20 ? "pink":
                        "red"; 
    }
    
    
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function(myMap) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-5, 5, 10, 20],
            labels = [];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        
        return div;
    }

    legend.addTo(myMap);

}