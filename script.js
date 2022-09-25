 
mapboxgl.accessToken =
  "pk.eyJ1Ijoic3d1LXRlc3QiLCJhIjoiY2tvdG9mdWM1MDV4OTJ2bzdmdnA5ejEyZyJ9.uuSmjrOs4J48Xek-YT6bgw";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/swu-test/cktnuxsl20nix17qowrvldwms",
  center: [126.942, 37.555],
  zoom: 14
});

map.on("load", () => {
  map.resize();
  map.addSource("places", {
  type: 'geojson',
  data: '/places.geojson'
});

  // Add a layer showing the state polygons.
  map.addLayer({
    id: "test-layer",
    type: "fill",
    source: "places",
    paint: {
      "fill-color": "rgba(255, 0, 255, 1)" //개체 컬러 바꾸기
    }
  });
  
    map.addLayer({
    id: "test-layer",
    type: "fill",
    source: "places",
    paint: {
      "fill-color": "rgba(255, 0, 255, 1)" //개체 컬러 바꾸기
    }
  });

  
  map.on('style.load', function () {
        map.addLayer({
            id: 'custom_layer',
            type: 'custom',
            source: "places",
            renderingMode: '3d',
            onAdd: function (map, mbxContext) {

                window.tb = new Threebox(
                    map,
                    mbxContext,
                    { defaultLights: true }
                );

                var options = {
                    obj: 'https://cdn.glitch.global/bab878d5-56dd-45eb-906b-767c5be85682/test.gltf?v=1662482246891',
                    type: 'gltf',
                    scale: 1,
                    units: 'meters',
                    rotation: { x: 90, y: 0, z: 0 } //default rotation
                }

                tb.loadObj(options, function (model) {
                    soldier = model.setCoords(origin);
                    tb.add(soldier);
                })

            },
            render: function (gl, matrix) {
                tb.update();
            }
        });
    })
  
  
  
  // 개체를 클릭하면 일어나는 이벤트를 설정하는 영역
  map.on("click", "test-layer", e => {
    document.getElementById("pd1").innerHTML =
      "<h1>" +
      e.features[0].properties.title +
      "<br>" +
      e.features[0].properties.add +
      "</div></h1>";
    document.getElementById("pd2").innerHTML =
      "<p>" + e.features[0].properties.info + "</p><img src='" + e.features[0].properties.img + "'/>";
  });

  
  
  // 마우스오버하면 마우스 포인터 모양 바뀜
  map.on("mouseenter", "test-layer", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  // 마우스가 이동하면 원래 마우스 모양으로 바뀜
  map.on("mouseleave", "test-layer", () => {
    map.getCanvas().style.cursor = "";
  });
});
