// 전역 변수
let hoveredPolygonId = null; 
let features;
// let isTarget;

// geojson 파일 불러오기
fetch('dong_polygon.geojson')
  .then(response => response.json())
  .then(data => {
    // 파일이 성공적으로 로드된 후에 데이터를 사용
    features = data.features;
  })
  .catch(error => {
    // 오류 처리
    console.error('파일 로딩 중 오류 발생:', error);
  });

// mapbox
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
  
  map.resize();
  
  map.rotateTo(180, { duration: 600000 });

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
      'symbol-placement': 'point',
      'text-field': ['get', 'Address_dong'],
      'text-size': 15,
      'text-offset': [0, -3],
      'text-anchor': 'center' 
    },
    paint: {
      "text-color": "rgba(0, 0, 0, 1)"
    },
    minzoom: 0, // 최소 줌 레벨
    maxzoom: 24, // 최대 줌 레벨
  });
  
  // dong_polygon
  map.addSource("dong_polygon", {
    type: 'geojson',
    data: '/dong_polygon.geojson',
    generateId: true
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
        0.9, // hover : true
        0.5 // hover: false
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
    'line-color': "rgba(59, 64, 84, 0.8)",
    'line-width': 1
    }
  });
  
  map.on('mouseenter', 'dong_polygon', (e) => {   
    map.getCanvas().style.cursor = "pointer";
    console.log("pointer: ", map.getCanvas().style.cursor);
    
    hoveredPolygonId = e.features[0].id; // 0번부터 시작

    if (hoveredPolygonId + 1 > 0) {
      map.setFeatureState(
        { source: 'dong_polygon', id: hoveredPolygonId },
        { hover: true }
      );
    }
  });

  map.on('mouseleave', 'dong_polygon', () => {
    map.getCanvas().style.cursor = "";
    console.log("pointer: ", map.getCanvas().style.cursor);
    
    if(hoveredPolygonId + 1 > 0) {
      map.setFeatureState(
        { source: 'dong_polygon', id: hoveredPolygonId },
        { hover: false }
      );        
    }    
    
    hoveredPolygonId = null;
  });  
});

  // test
  var leftBtn = document.getElementById("ctl_left");
  var rightBtn = document.getElementById("ctl_right");
  var homeBtn = document.getElementById("home");
  var currentIndex = 0;
  var target;

  function setHome() {
    document.getElementById("info-box").style.opacity = "0";
    document.getElementById("project-title").style.opacity = "100";
    document.getElementById("ctl_left").style.visibility = "hidden"; 
    document.getElementById("ctl_right").style.visibility = "hidden";
    document.getElementById("home").style.visibility = "hidden"; 

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

  function targetByIndex(currentIndex) {                              
    const targetFeature = features.find(feature => feature.properties.Index === currentIndex);
    
    return targetFeature;
  }


  function loadTargetInfo(target) {
    hoveredPolygonId = target.id;
    
    document.getElementById("info-box").style.opacity = "100";
    document.getElementById("project-title").style.opacity = "0";
    document.getElementById("ctl_left").style.visibility = "visible"; 
    document.getElementById("ctl_right").style.visibility = "visible";
    document.getElementById("home").style.visibility = "visible";  

    document.getElementById("address_sigu").innerHTML =
      target.properties.Address_si + " " + target.properties.Address_gu;

    document.getElementById("address_dong").innerHTML =
      target.properties.Address_dong;
    
    // <div class="profile">
    //   <div class="pict"> <img src="https://www.w3schools.com/whatis/img_js.png"> </div>
    //   <div class="name"> 이름 </div>
    // </div>    
    
  
    
    var lat = target.properties.Latitude;
    var long = target.properties.Longitude;
    var coord = [long, lat-0.005];
    var zoom = target.properties.Zoom;
    var pitch = target.properties.Pitch;

    map.flyTo({
      center: coord,
      zoom: zoom,
      pitch: pitch,
      duration: 2000,
      essential: true
    }); 
  } 

map.on("click", "dong_polygon", e => {
  target = e.features[0];
  currentIndex = (target.properties.Index);
  
  loadTargetInfo(target);
});

leftBtn.addEventListener("click", function() {  
  currentIndex = ((currentIndex - 1 + 15) % 15);
  target = targetByIndex(currentIndex);
  
  loadTargetInfo(target);
});

rightBtn.addEventListener("click", function() {
  currentIndex = ((currentIndex + 1 + 15) % 15);
  target = targetByIndex(currentIndex);
  
  loadTargetInfo(target); 
});

homeBtn.addEventListener("click", function() {
  currentIndex = -1;
  
  setHome();
});


