// 전역 변수
let hoveredPolygonId = null; 
let features_polygon;
let features_profile;
let features_nature;

let nature_marker;
let nature_popup;

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

fetch('dong_nature.geojson')
  .then(response => response.json())
  .then(data => {
    features_nature = data.features;
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
      'text-allow-overlap': true, // 레이블 겹침 방지
      'symbol-placement': 'point',
      'text-field': ['get', 'Address_dong'],
      'text-size': 16.5,
      'text-offset': [
        'interpolate', ['linear'], ['zoom'],
        11, ['literal', [0, -4]],
        15, ['literal', [0, -15]],
        20, ['literal', [0, -20]]
      ],
      'text-anchor': 'center' 
    },
    paint: {
      "text-color": "rgba(0, 0, 0, 1)",
      'text-opacity': 0.8
    },
    minzoom: 0, // 최소 줌 레벨
    maxzoom: 24, // 최대 줌 레벨
  });
    
  // dong_icon
  // https://cdn.glitch.global/1a457f74-eb98-4ed1-8631-b5320b847340/pos.png?v=1695349509014
  map.loadImage('https://cdn.glitch.global/6866da1d-b241-4b37-a22b-ab00a9127f17/village_icon.png?v=1697728256494', function (error, image) {
    if (error) throw error;
    map.addImage('dong_icon', image); // 이미지를 맵에 추가합니다.
    
    map.addLayer({
      'id': 'dong_icon',
      'type': 'symbol',
      'source': 'dong_point',
      'layout': {
        'icon-image': 'dong_icon', // reference the image
        'icon-size': 0.06,
        'icon-size': {
          type: 'exponential',
            stops: [ 
              [10, 0.03],
              [24, 0.4]
            ]
          },
        'icon-anchor': 'top',
        'icon-padding': 5,
        'icon-offset': [0, -700]
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
  
  
  // event
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

  // button
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
    const targetProfiles = features_profile.filter(feature => feature.Address_dong === target.properties.Address_dong);
    
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
    
    
    const targetNatures = features_nature.filter(feature => feature.properties.Address_dong === target.properties.Address_dong);
    
    for (let i = 0; i < targetNatures.length; i++) {
      const markerDiv = document.createElement("div");
      markerDiv.className = "nature_marker";
      
      // make a marker for each feature and add it to the map
      nature_marker = new mapboxgl.Marker(markerDiv)
        .setLngLat(targetNatures[i].geometry.coordinates)
        .addTo(map);
      
      nature_popup = new mapboxgl.Popup({ closeOnClick: true, offset: 10 }) // add popups
        .setLngLat(targetNatures[i].geometry.coordinates)
        .setHTML(`<h3>${targetNatures[i].properties.Name}</h3>`)
        .addTo(map);      
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

function removeNature() {
  
}

map.on("click", "dong_polygon", e => {
  target = e.features[0];
  currentIndex = (target.properties.Index);
  
  if (nature_marker && nature_popup) {
    nature_marker.remove();
    nature_popup.remove();
    console.log("remove")
  }
  
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


