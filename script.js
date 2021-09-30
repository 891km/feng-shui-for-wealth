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

map.on("load", () => {
  map.resize();
  
  map.addSource("places", {
  type: 'geojson',
  data: '/places.geojson'
});
/*
  map.addSource("places", {
    
    type: "geojson",
    data: [
      [
        {
          type: "Feature",
          properties: {
            title: "Place Name 4",
            info:
              "세부 설명글이 들어갑니다. 테스트. 세부 설명글이 들어갑니다.세부 설명글이 들어갑니다. 테스트. 세부 설명글이 들어갑니다. 세부 설명글이 들어갑니다. 테스트. 세부 설명글이 들어갑니다.",
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
      ],

      [
        {
          type: "Feature",
          properties: {
            title: "Place Name 3",
            info:
              "세부 설명글이 들어갑니다. 테스트. 세부 설명글이 들어갑니다.세부 설명글이 들어갑니다. 테스트. 세부 설명글이 들어갑니다. 세부 설명글이 들어갑니다. 테스트. 세부 설명글이 들어갑니다.",
            add: "이화여대"
          },
          geometry: {
            coordinates: [
              [
                [126.940016, 37.562377],
                [126.940563, 37.561841],
                [126.94141, 37.561731],
                [126.941927, 37.562097],
                [126.94124, 37.562751],
                [126.941347, 37.562811],
                [126.941004, 37.5631],
                [126.940016, 37.562377]
              ]
            ],
            type: "Polygon"
          }
        }
      ]
    ]
  });
  */

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
    document.getElementById("pd1").innerHTML =
      "<h1>" +
      e.features[0].properties.title +
      "<br>" +
      e.features[0].properties.add +
      "</div></h1>";
    document.getElementById("pd2").innerHTML =
      "<p>" + e.features[0].properties.info + "</p>";
  });

  // Change the cursor to a pointer when
  // the mouse is over the layer.
  map.on("mouseenter", "test-layer", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  // Change the cursor back to a pointer
  map.on("mouseleave", "test-layer", () => {
    map.getCanvas().style.cursor = "";
  });
});
