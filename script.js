 
mapboxgl.accessToken =
  "pk.eyJ1IjoiODkxa20iLCJhIjoiY2xsenowYWlpMTc5eTNpczZ3czJnaDNnZCJ9.MJ5L9o66OPTMzllWEW_17Q";

const map = new mapboxgl.Map({
  container: "map", // id
  style: "mapbox://styles/891km/clmr9ohkz01yj01r64l03bouv/draft",
  center: [127.063, 37.457],
  zoom: 10.8,
  minZoom: 10.3,
  pitch: 64.5,
  bearing: 16
});

map.on("load", () => {
  
  map.getCanvas().getContext('webgl'),
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
      'text-size': 15,
      'text-offset': [0, -2],
      'text-anchor': 'center' 
    },
    paint: {
      "text-color": "rgba(0, 0, 0, 1)",
    }    
  });
  
});



// 개체를 클릭하면 일어나는 이벤트를 설정하는 영역
map.on("click", "selected_dong", e => {
  document.getElementById("address_sigu").innerHTML =
    e.features[0].properties.Address_si + " " + e.features[0].properties.Address_gu;

  document.getElementById("address_dong").innerHTML =
    e.features[0].properties.Address_dong;
  
    const coord = e.features[0].geometry.coordinates;
    map.setCenter(coord);
    map.setZoom(12); // 동네마다 값 저장하기
    map.setPitch(55);
});


// 마우스오버하면 마우스 포인터 모양 바뀜
map.on("mouseenter", "selected_dong", () => {
  
  map.getCanvas().style.cursor = "pointer";
  // map.setPaintProperty('text-layer', 'text-color', 'rgba(255, 0, 0, 0)');
});


// 마우스가 이동하면 원래 마우스 모양으로 바뀜
map.on("mouseleave", "selected_dong", () => {
  map.getCanvas().style.cursor = "";
});
