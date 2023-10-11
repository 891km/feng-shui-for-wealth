 
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
      "fill-color": "rgb(59, 64, 84)",
      
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        1,
        0.8
      ]
    }    
  });
  
  // dong_line
  map.addLayer({
    'id': 'dong_line',
    'type': 'line',
    'source': 'dong_polygon',
    'layout': {},
    'paint': {
    'line-color': "rgba(255, 255, 255, 0.5)",
    'line-width': 1
    }
  });
  
});


// test
var leftBtn = document.getElementById("ctl_left");
var rightBtn = document.getElementById("ctl_right");
var homeBtn = document.getElementById("home");
var currentIndex = 0;
var target;

function targetByIndex(currentIndex) {
  const targetFeatures = map.querySourceFeatures('dong_polygon');
  return targetFeatures.find(feature => feature.properties.Index === currentIndex);
}

function loadTargetInfo(target) {
  document.getElementById("info-box").style.opacity = "100";
  document.getElementById("project-title").style.opacity = "0";
  document.getElementById("ctl_left").style.visibility = "visible"; 
  document.getElementById("ctl_right").style.visibility = "visible";  
  
  document.getElementById("address_sigu").innerHTML =
    target.properties.Address_si + " " + target.properties.Address_gu;
  
  document.getElementById("address_dong").innerHTML =
    target.properties.Address_dong;
  
  var pos = JSON.parse(target.properties.Pos);
  var coord = [pos[0], pos[1]];
  var zoom = target.properties.Zoom;
  var pitch = target.properties.Pitch;
  
  map.flyTo({
    center: coord,
    zoom: zoom,
    pitch: pitch,
    duration: 1500,
    essential: true
  });    
}

// 개체를 클릭하면 일어나는 이벤트를 설정하는 영역
map.on("click", "dong_polygon", e => {
  target = e.features[0];
  currentIndex = target.properties.Index;
  
  loadTargetInfo(target);

});

leftBtn.addEventListener("click", function() {
  currentIndex = ((currentIndex - 1 + 15) % 15);
  target = targetByIndex(currentIndex);
  console.log(currentIndex, target)

  loadTargetInfo(target);
});

rightBtn.addEventListener("click", function() {
  currentIndex = ((currentIndex + 1 + 15) % 15);
  target = targetByIndex(currentIndex);
  console.log(currentIndex, target)
  
  loadTargetInfo(target); 
});

homeBtn.addEventListener("click", function() {
  currentIndex = -1;
  
  if (currentIndex == -1) {
    document.getElementById("info-box").style.opacity = "0";
    document.getElementById("project-title").style.opacity = "100";
    document.getElementById("ctl_left").style.visibility = "hidden"; 
    document.getElementById("ctl_right").style.visibility = "hidden";    

    map.flyTo({
      center: [127.063, 37.447],
      zoom: 11.1,
      minZoom: 10.3,
      pitch: 64.5,
      bearing: 16,
      duration: 1500,
      essential: true
    });         
  }  
});




// 마우스가 이동하면 원래 마우스 모양으로 바뀜
map.on("mouseleave", "dong_fill", (e) => {
  map.getCanvas().style.cursor = "";
});


// 마우스오버하면 마우스 포인터 모양 바뀜
map.on("mouseenter", "dong_fill", (e) => {
  map.getCanvas().style.cursor = "pointer";
  // map.setPaintProperty('dong_fill', 'fill-color', 'rgba(255, 0, 0, 0)');
});

// 마우스가 이동하면 원래 마우스 모양으로 바뀜
map.on("mouseleave", "dong_fill", (e) => {
  map.getCanvas().style.cursor = "";
});
