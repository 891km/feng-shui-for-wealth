 
mapboxgl.accessToken =
  "pk.eyJ1IjoiODkxa20iLCJhIjoiY2xsenowYWlpMTc5eTNpczZ3czJnaDNnZCJ9.MJ5L9o66OPTMzllWEW_17Q";

const map = new mapboxgl.Map({
  container: "map", // id
  style: "mapbox://styles/891km/clmr9ohkz01yj01r64l03bouv/draft",
  center: [127.049304, 37.477148],
  zoom: 10.8,
  minZoom: 10.3,
  pitch: 64.5,
  bearing: 16
});

map.on("load", () => {
  map.resize();
  // map.rotateTo(180, { duration: 100000 });
  
  // map.addSource("places", {
  // type: 'geojson',
  // data: '/places.geojson'
  // });
});
  
// Add a layer showing the state polygons. 폴리곤 디자인 커스텀
// map.addLayer({
//   id: "test-layer",
//   type: "fill",
//   source: "places",
//   paint: {
//     "fill-color": "rgba(255, 0, 255, 1)" //개체 컬러 바꾸기
//   }
// });

  map.addLayer({
    id: "Address_dong",
    type: "Point",
    source: "dongname",
    // layout: {
    //   'text-field': ['get', 'label'], // 텍스트 레이블로 표시할 속성 필드 설정
    //   'text-size': 12, // 텍스트 크기 설정
    //   'text-anchor': 'center', // 텍스트 정렬 설정 (가운데 정렬)
    // },
    paint: {
      "fill-color": "rgba(255, 0, 0, 1)" // 개체 컬러 바꾸기
    }
  });


// 개체를 클릭하면 일어나는 이벤트를 설정하는 영역
map.on("click", "Address_dong", e => {
  document.getElementById("Address_si").innerHTML =
    "<h1>" +
    e.features[0].properties.title +
    "<br>" +
    e.features[0].properties.add +
    "</div></h1>";
  document.getElementById("Address_dong").innerHTML =
    "<p>" + e.features[0].properties.info + "</p><img src='" + e.features[0].properties.img + "'/>";
});


// 마우스오버하면 마우스 포인터 모양 바뀜
map.on("mouseenter", "Address_dong", () => {
  map.getCanvas().style.cursor = "pointer";
});


// 마우스가 이동하면 원래 마우스 모양으로 바뀜
map.on("mouseleave", "Address_dong", () => {
  map.getCanvas().style.cursor = "";
});
