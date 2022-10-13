 
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
