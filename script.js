 
mapboxgl.accessToken =
  "pk.eyJ1IjoiODkxa20iLCJhIjoiY2xsenowYWlpMTc5eTNpczZ3czJnaDNnZCJ9.MJ5L9o66OPTMzllWEW_17Q";

const map = new mapboxgl.Map({
  container: "map", // id
  style: "mapbox://styles/891km/clmr9ohkz01yj01r64l03bouv/draft",
  center: [127.063, 37.447],
  zoom: 11.1,
  minZoom: 10.3,
  pitch: 64.5,
  bearing: 16
});

map.on("load", () => {
  
  map.getCanvas().getContext('webgl'),
  map.resize();
  
  // map.rotateTo(180, { duration: 200000 });


  // dong_point
  map.addSource("dong_point", {
    type: 'geojson',
    data: '/dong_point.geojson' 
  });
  
  map.addLayer({
    id: "dong_point",
    type: "symbol",
    source: "dong_point",
    layout: {
      'text-field': ['get', 'Address_dong'],
      'text-size': 15,
      'text-offset': [0, -2],
      'text-anchor': 'center' 
    },
    paint: {
      "text-color": "rgba(0, 0, 0, 1)"
    }    
  });

  
  // dong_polygon
  map.addSource("dong_polygon", {
    type: 'geojson',
    data: '/dong_polygon.geojson' 
  });
   
  map.addLayer({
    id: "dong_polygon",
    type: "fill",
    source: "dong_polygon",
    paint: {
      "fill-color": "rgba(255, 0, 255, 0.5)",
      
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        1,
        0.5
      ]
      
    }    
  });
  
});





// 개체를 클릭하면 일어나는 이벤트를 설정하는 영역
map.on("click", "dong_polygon", e => {
  document.getElementById("info-box").style.opacity = "100";
  document.getElementById("project-title").style.opacity = "0";                                     
  
  document.getElementById("address_sigu").innerHTML =
    e.features[0].properties.Address_si + " " + e.features[0].properties.Address_gu;

  document.getElementById("address_dong").innerHTML =
    e.features[0].properties.Address_dong;
  
  var pos = JSON.parse(e.features[0].properties.Pos);
  var coord = [pos[0], pos[1]];
  var zoom = e.features[0].properties.Zoom;
  var pitch = e.features[0].properties.Pitch;
  
  map.flyTo({
    center: coord,
    zoom: zoom,
    pitch: pitch,
    essential: true
  });  
  
});


map.on('mousemove', 'dong_polygon', (e) => {
  if (e.features.length > 0) {
    if (hoveredPolygonId !== null) {
      map.setFeatureState(
          { source: 'states', id: hoveredPolygonId },
          { hover: false }
        );
    }
      hoveredPolygonId = e.features[0].id;
      map.setFeatureState(
        { source: 'states', id: hoveredPolygonId },
        { hover: true }
      );
    }
});

// // 마우스오버하면 마우스 포인터 모양 바뀜
// map.on("mouseenter", "dong_fill", (e) => {
  
//   map.getCanvas().style.cursor = "pointer";
//   map.setPaintProperty('dong_fill', 'fill-color', 'rgba(255, 0, 0, 0)');
// });


// // 마우스가 이동하면 원래 마우스 모양으로 바뀜
// map.on("mouseleave", "dong_fill", (e) => {
//   map.getCanvas().style.cursor = "";
//   map.setPaintProperty('dong_fill', 'fill-color', 'rgba(255, 0, 255, 0.5)');
// });
