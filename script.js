// 전역 변수
let hoveredPolygonId = null; 
let features_polygon;
let features_profile;
// let isTarget;

// geojson 파일 불러오기
fetch('dong_polygon.geojson')
  .then(response => response.json())
  .then(data => {
    features_polygon = data.features;
  })
  .catch(error => {
    console.error('파일 로딩 중 오류 발생:', error);
  });

fetch('dong_profile.json')
  .then(response => response.json())
  .then(data => {
    features_profile = data;
  })
  .catch(error => {
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
  map.rotateTo(180, { duration: 800000 });

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
  
  
  // dong_icon 
  map.loadImage('https://cdn.glitch.global/1a457f74-eb98-4ed1-8631-b5320b847340/pos.png?v=1695349509014', function (error, image) {
    if (error) throw error;
    map.addImage('dong_icon', image); // 이미지를 맵에 추가합니다.
    map.addSource("dong_icon", {
      type: 'geojson',
      data: '/dong_point.geojson' 
    });
    
    map.addLayer({
      'id': 'dong_icon',
      'type': 'symbol',
      'source': 'dong_icon',
      'layout': {
        'icon-image': 'dong_icon', // reference the image
        'icon-size': 0.05
      }
    });
      
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
    const targetFeature = features_polygon.find(feature => feature.properties.Index === currentIndex);
    
    return targetFeature;
  }


  function loadTargetInfo(target) {
    hoveredPolygonId = target.id;
    document.getElementById("profile_grid").innerHTML = '';
    
    // elem visibility
    document.getElementById("info-box").style.opacity = "100";
    document.getElementById("project-title").style.opacity = "0";
    document.getElementById("ctl_left").style.visibility = "visible"; 
    document.getElementById("ctl_right").style.visibility = "visible";
    document.getElementById("home").style.visibility = "visible";  

    document.getElementById("address_sigu").innerHTML =
      target.properties.Address_si + " " + target.properties.Address_gu;

    document.getElementById("address_dong").innerHTML =
      target.properties.Address_dong;
    
    
    // profile grid to html
    const targetProfiles = features_profile.filter(dong => dong.Address_dong === target.properties.Address_dong);
    
    var parentDiv = document.getElementById("profile_grid");
    for (let i = 0; i < targetProfiles.length; i++) {
      var profileDiv = document.createElement('div');
      profileDiv.className = 'profile';

      var imgElement = document.createElement('img');
      imgElement.className = 'pict';
      imgElement.src = targetProfiles[i].url;
      
      var nameDiv = document.createElement('div');
      nameDiv.className = 'name';      
      nameDiv.textContent = targetProfiles[i].name;
      
      profileDiv.appendChild(imgElement);
      profileDiv.appendChild(nameDiv);

      parentDiv.appendChild(profileDiv);      
    }    
    

    
    // target coord
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

// // 마커 아이콘을 화면에 나타내고, 각 마커와 위 json 정보를 연결하는 부분
// for (const { geometry, properties } of features_polygon) {
//   console.log(features_polygon);
//   // create a HTML element for each feature
//   const markerDiv = document.createElement("div");
//   markerDiv.className = "marker";

//   // make a marker for each feature and add it to the map
//   new mapboxgl.Marker(markerDiv)
//     .setLngLat(geometry.coordinates)
//     .setPopup(
//       new mapboxgl.Popup({ offset: 35 }) // add popups
//         .setHTML(`<h3>${properties.title}</h3><p>${properties.description}</p><p>${properties.address}</p>`)
//     )
//     .addTo(map);
// }

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


