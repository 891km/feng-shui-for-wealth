/*
This is your site JavaScript code - you can add interactivity and carry out processing
- Initially the JS writes a message to the console, and rotates a button you can add from the README
*/

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3d1LXRlc3QiLCJhIjoiY2tvdG9mdWM1MDV4OTJ2bzdmdnA5ejEyZyJ9.uuSmjrOs4J48Xek-YT6bgw";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/swu-test/cktnuxsl20nix17qowrvldwms",
  center: [126.942, 37.56],
  zoom: 14
});

map.on("load", function() {
  map.resize();
});

map.addSource("my-data", {
  type: "vector",
  url: "mapbox://swu-test.cktnv714u217l21rupi3xtsiy"
});

map.addLayer({
  id: "states-layer",
  type: "fill",
  source: "my-data",
  paint: {
    "fill-color": "rgba(200, 100, 240, 0.4)",
    "fill-outline-color": "rgba(200, 100, 240, 1)"
  }
});
map.on('click', 'states-layer', (e) => {
new mapboxgl.Popup()
.setHTML(e.features[0].properties.name)
.addTo(map);
});

/*
map.on("click", function(e) {
  var places = map.queryRenderedFeatures(e.point, {
    layers: ["test3"]
  });
  let was_added = false;

  if (places.length > 0) {
    let pd = document.getElementById("pd1");
    let pd2 = document.getElementById("pd2");

    pd.innerHTML =
      "<h1>" +
      places[0].properties.title +
      "<br>" +
      places[0].properties.add +
      "</div></h1>";
    pd2.innerHTML = "<p>" + places[0].properties.info + "</p>";
  }
});*/
