/*
This is your site JavaScript code - you can add interactivity and carry out processing
- Initially the JS writes a message to the console, and rotates a button you can add from the README
*/

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3d1LXRlc3QiLCJhIjoiY2tvdG9mdWM1MDV4OTJ2bzdmdnA5ejEyZyJ9.uuSmjrOs4J48Xek-YT6bgw";
const map = new mapboxgl.Map({
  container: "mapContainer",
  style: "mapbox://styles/swu-test/ckotoiitv68eo17sfjxzk1i90",
  center: [126.938, 37.549],
  zoom: 12
});

const geojson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [126.94555137267065, 37.5521900079999]
      },
      properties: {
        title: 'Mapbox',
        description: 'Washington, D.C.'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [126.940016, 37.562377]
      },
      properties: {
        title: 'Mapbox',
        description: 'San Francisco, California'
      }
    }
  ]
};

// add markers to map
for (const { geometry, properties } of geojson.features) {
  // create a HTML element for each feature
  const el = document.createElement('div');
  el.className = 'marker';

// make a marker for each feature and add to the map
  new mapboxgl.Marker(el).setLngLat(geometry.coordinates).addTo(map);
}

new mapboxgl.Marker(el)
  .setLngLat(geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
      .setHTML(`<h3>${properties.title}</h3><p>${properties.description}</p>`)
  )
  .addTo(map);

map.on("load", function() {
  map.resize();
});