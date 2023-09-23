 
mapboxgl.accessToken =
  "pk.eyJ1IjoiODkxa20iLCJhIjoiY2xsenowYWlpMTc5eTNpczZ3czJnaDNnZCJ9.MJ5L9o66OPTMzllWEW_17Q";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/891km/clmr9ohkz01yj01r64l03bouv",
  center: [127.052525, 37.449937],
  zoom: 10
});

map.on("load", () => {
  map.resize();
  map.addSource("places", {
  type: 'geojson',
  data: '/places.geojson'
    
});

  // Add a layer showing the state polygons. 폴리곤 디자인 커스텀
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
    document.getElementById("info1").innerHTML =
      "<h1>" +
      e.features[0].properties.title +
      "<br>" +
      e.features[0].properties.add +
      "</div></h1>";
    document.getElementById("info2").innerHTML =
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
