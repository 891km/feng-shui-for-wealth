 
mapboxgl.accessToken =
  "pk.eyJ1IjoiODkxa20iLCJhIjoiY2xsenowYWlpMTc5eTNpczZ3czJnaDNnZCJ9.MJ5L9o66OPTMzllWEW_17Q";

const map = new mapboxgl.Map({
  container: "map", // id
  style: "mapbox://styles/891km/clmr9ohkz01yj01r64l03bouv/draft",
  center: [127.073, 37.457],
  zoom: 10.8,
  minZoom: 10.3,
  pitch: 64.5,
  bearing: 16
});

map.on("load", () => {
  
  map.resize();
  
  // map.rotateTo(180, { duration: 200000 });
  
  map.addSource("dongname", {
    type: 'geojson',
    data: '/dongname.geojson' 
  });  
  

  map.addLayer({
    id: "selected_dong",
    type: "symbol",
    source: "dongname",
    layout: {
      'text-field': ['get', 'Address_dong'],
      'text-size': 12
    }
  });
  
});



// 개체를 클릭하면 일어나는 이벤트를 설정하는 영역
map.on("click", "selected_dong", e => {
  document.getElementById("info-box").innerHTML =
    "<h1>" +
    e.features[0].properties.title +
    "<br>" +
    e.features[0].properties.add +
    "</div></h1>";
  document.getElementById("Address_dong").innerHTML =
    "<p>" + e.features[0].properties.info + "</p><img src='" + e.features[0].properties.img + "'/>";
});


// 마우스오버하면 마우스 포인터 모양 바뀜
map.on("mouseenter", "selected_dong", () => {
  map.getCanvas().style.cursor = "pointer";
});


// 마우스가 이동하면 원래 마우스 모양으로 바뀜
map.on("mouseleave", "selected_dong", () => {
  map.getCanvas().style.cursor = "";
});
