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

let pd = document.getElementById("pd1");
let pd2 = document.getElementById("pd2");



map.on("load", () => {
  map.resize();
  // Add a source for the state polygons.
  map.addSource("places", {
    type: "geojson",
    data: {
      type: "Feature",
      properties: {
        title: "Place Name 4",
        info: "세부 설명글이 들어갑니다. 테스트. 세부 설명글이 들어갑니다.세부 설명글이 들어갑니다. 테스트. 세부 설명글이 들어갑니다. 세부 설명글이 들어갑니다. 테스트. 세부 설명글이 들어갑니다.",
        add: "도서관"
      },
      geometry: {
        coordinates: [
          [
            [126.945551, 37.55219],
            [126.945371, 37.55138],
            [126.945611, 37.551046],
            [126.946416, 37.55116],
            [126.94656, 37.552085],
            [126.945551, 37.55219]
          ]
        ],
        type: "Polygon"
      }
    }
  });

  // Add a layer showing the state polygons.
  map.addLayer({
    id: "test-layer",
    type: "fill",
    source: "places",
    paint: {
      "fill-color": "rgba(200, 100, 240, 1)"
    }
  });

  // When a click event occurs on a feature in the states layer,
  // open a popup at the location of the click, with description
  // HTML from the click event's properties.
  map.on("click", "test-layer", e => {
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(e.features[0].properties.name)
      .addTo(map);
  });

  // Change the cursor to a pointer when
  // the mouse is over the states layer.
  map.on("mouseenter", "test-layer", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change the cursor back to a pointer
  // when it leaves the states layer.
  map.on("mouseleave", "test-layer", () => {
    map.getCanvas().style.cursor = "";
  });
});

/*
map.on("load", () => {
  map.resize();
  
  map.on("click", function(e) {
  var places = map.queryRenderedFeatures(e.point, {
    layers: ["test3"]
  });
  let was_added = false;

  if (places.length > 0) {
    let pd = document.getElementById("pd1");
    let pd2 = document.getElementById("pd2");

    pd.innerHTML =
      "<h1>" + places[0].properties.title + "<br>" + 
      places[0].properties.add + "</div></h1>";
    pd2.innerHTML = "<p>" + places[0].properties.info + "</p>";
  }
  
});

// Change the cursor to a pointer when
// the mouse is over the states layer.
map.on('mouseenter', function(e) {
  var places2 = map.queryRenderedFeatures(e.point, {
    layers: ["test3"]
  });
map.getCanvas().style.cursor = 'pointer';
});
 
// Change the cursor back to a pointer
// when it leaves the states layer.
map.on('mouseleave', 'places', () => {
map.getCanvas().style.cursor = '';
});  
  
});

*/
