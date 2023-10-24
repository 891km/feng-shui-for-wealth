// 전역 변수
let hoveredPolygonId = null; 
let features_point;
let features_polygon;
let features_profile;
let features_nature;

let nature_marker;
let nature_popup;
let markers = [];
let popups = [];


// geojson 파일 불러오기
fetch('dong_point.geojson')
  .then(response => response.json())
  .then(data => {
    features_point = data.features;
  })
  .catch(error => {
    console.error('파일 로딩 중 오류 발생:', error);
  });

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
  attributionControl: false,
  center: [127.063, 37.46],
  zoom: 11.1,
  minZoom: 10.3,
  pitch: 64.5,
  bearing: 16
});

map.on('pitch', function() {
  console.log("zoom:", Math.round(map.getZoom(),2), "pitch:", Math.round(map.getPitch(),2), "bearing:", Math.round(map.getBearing(),2));
});
map.on('zoom', function() {
  console.log("zoom:", Math.round(map.getZoom(),2), "pitch:", Math.round(map.getPitch(),2), "bearing:", Math.round(map.getBearing());
});
map.on('bearing', function() {
  console.log("zoom:", Math.round(map.getZoom(),2), "pitch:", Math.round(map.getPitch(),2), "bearing:", map.getBearing());
});

function initialSetLayers() {
  if (!map.getSource('dong_point')) {
    // dong_point
    map.addSource("dong_point", {
      type: 'geojson',
      data: '/dong_point.geojson',
    });
  }
  
  if (!map.getLayer('dong_point')) {
    map.addLayer({
    id: "dong_point",
    type: "symbol",
    source: "dong_point",
    layout: {
      'text-font': ['source-han-sans-korean', 'regular'],
      'text-allow-overlap': [
        'step',
        ['zoom'],
        false, // 0부터 시작하는 zoom 레벨에서는 표시
        11.9, true
      ],
      'symbol-placement': 'point',
      'text-field': ['get', 'Address_dong'],
      'text-size': 17,
      'text-offset': [
        'interpolate', ['linear'], ['zoom'],
        11, ['literal', [0, -3]],
        13, ['literal', [0, -15]],
        20, ['literal', [0, -20]]
      ],
      'text-anchor': 'center' 
    },
    paint: {
      "text-color": "rgba(0, 0, 0, 1)",
      'text-opacity': 1
    },
    minzoom: 0, // 최소 줌 레벨
    maxzoom: 24, // 최대 줌 레벨
  });
  };
    
  if (!map.hasImage('dong_icon')) {
    // dong_icon load
    map.loadImage('https://cdn.glitch.global/6866da1d-b241-4b37-a22b-ab00a9127f17/village_icon.png?v=1697728256494', function (error, image) {
    if (error) throw error;
    map.addImage('dong_icon', image); // 이미지를 맵에 추가합니다.
    });
  };
  
  if (!map.getLayer('dong_icon')) {
    // dong_icon 
    map.addLayer({
      'id': 'dong_icon',
      'type': 'symbol',
      'source': 'dong_point',
      'layout': {
        'icon-allow-overlap': [
          'step',
          ['zoom'],
          false, // 0부터 시작하는 zoom 레벨에서는 표시
          11.9, true
        ],
        'icon-image': 'dong_icon',
        'icon-size': 0.06,
        'icon-size': {
          type: 'exponential',
            stops: [ 
              [10, 0.03],
              [24, 0.4]
            ]
          },
        'icon-anchor': 'top',
        'icon-offset': [0, -500]
      }
    });
  };
      
  if (!map.getSource('dong_polygon')) {
    // dong_polygon
    map.addSource("dong_polygon", {
      type: 'geojson',
      data: '/dong_polygon.geojson',
      generateId: true
    });
  };
   
  if (!map.getLayer('dong_polygon')) {
    map.addLayer({
    id: "dong_polygon",
    type: "fill",
    source: "dong_polygon",
    paint: {
      "fill-color": "#2F364E",
      // "fill-color": "rgb(59, 64, 84)",
      'fill-opacity': [
        'case', 
        ['boolean', ['feature-state', 'hover'], false],
        0.9, // hover : true
        0.6 // hover: false
      ]
    } 
  }); 
  };
  
  if (!map.getLayer('dong_line')) {
    // dong_line
    map.addLayer({
      'id': 'dong_line',
      'type': 'line',
      'source': 'dong_polygon',
      'layout': {},
      'paint': {
      'line-color': "rgba(59, 64, 84, 1)",
      // 'line-color': "rgba(59, 64, 84, 0.8)",
      'line-width': 1
      }
    });
  };
  
  if (!map.hasImage('nature_icon')) {
    // nature icon image load
    map.loadImage('https://cdn.glitch.global/4300c893-b7d0-43b8-97e2-45113b955d30/pin.png?v=1697743554730', function (error, image) {
    if (error) throw error;
      map.addImage('nature_icon', image);
  });   
  }
};

function resetLayer() { 
  if (map.getLayer('target_dong_icon')) {
    map.removeLayer('target_dong_icon');
  }
  if (map.getLayer('dong_icon')) {
    map.removeLayer('dong_icon');
  } 
  if (map.getLayer('nature_label')) {
    map.removeLayer('nature_label');
  }
  if (map.getLayer('nature_icon')) {
    map.removeLayer('nature_icon');
  }
  if (map.getSource('dong_nature')) {
    map.removeSource('dong_nature');
  }
  if (map.getSource('target_dong_icon')) {
    map.removeSource('target_dong_icon');
  }  
}

map.on("load", () => {
  map.resize();
  map.rotateTo(180, { duration: 800000 });

  initialSetLayers();
  
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

  map.on('mouseleave', 'dong_polygon', (e) => {
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
var titleBtn = document.getElementById("project-title");
var infoBtn = document.getElementById("project-info");
var infoXBtn = document.getElementById("popup-x");
var currentIndex = 0;
var target;

function setHome() {
  document.getElementById("info-box").style.opacity = "0";
  document.getElementById("project-title").style.opacity = "100";
  document.getElementById("ctl_left").style.visibility = "hidden"; 
  document.getElementById("ctl_right").style.visibility = "hidden";
  
  initialSetLayers();

  map.flyTo({
    center: [127.063, 37.46],
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
  // reset    
  resetLayer();
  hoveredPolygonId = target.id;
  document.getElementById("profile_grid").innerHTML = '';

  // elem visibility
  document.getElementById("info-box").style.opacity = "100";
  document.getElementById("ctl_left").style.visibility = "visible"; 
  document.getElementById("ctl_right").style.visibility = "visible";

  // info-box content
  document.getElementById("address_sigu").innerHTML =
    target.properties.Address_si + " " + target.properties.Address_gu;
  document.getElementById("address_dong").innerHTML =
    target.properties.Address_dong;
  document.getElementById("address_des").innerHTML =
    target.properties.Info;

  // profile
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

  // target nauture label & icon
  const targetNatures = {
    type: 'FeatureCollection',
    features: features_nature.filter(feature => feature.properties.Address_dong === target.properties.Address_dong)
  };
  map.addSource("dong_nature", {
    type: 'geojson',
    data: targetNatures
  });

  map.addLayer({
    id: "nature_label",
    type: "symbol",
    source: "dong_nature",
    layout: {
      'text-allow-overlap': true, // 레이블 겹침 방지
      'symbol-placement': 'point',
      'text-field': ['get', 'Name'],
      'text-size': 15,
      'text-offset': [0, -10],
      'text-anchor': 'bottom' 
    },
    paint: {
      "text-color": "rgba(0, 0, 0, 1)",
      'text-opacity': 0.8
    }
  });

  map.addLayer({
    'id': 'nature_icon',
    'type': 'symbol',
    'source': 'dong_nature',
    'layout': {
      'icon-allow-overlap': true,
      'icon-image': 'nature_icon',
      'icon-size': 0.26,
      'icon-anchor': 'bottom',
      'icon-offset': [0, 0]
    }
  });  

  
  // only target dong_point (label)
  map.setLayoutProperty('dong_point', 'text-offset', [
    'case',
    ['!=', ['get', 'Address_dong'], target.properties.Address_dong],
    ['literal', [0, -1]],
    ['literal', [0, -4]] // target feature
  ]);
  
  map.setPaintProperty('dong_point', 'text-opacity', [
    'case',
    ['!=', ['get', 'Address_dong'], target.properties.Address_dong],
    0.4, 1 // target feature
  ]);

  map.setLayoutProperty('dong_point', 'text-font', [
    'case',
    ['!=', ['get', 'Address_dong'], target.properties.Address_dong],
    ['literal', ['source-han-sans-korean', 'regular']],
    ['literal', ['source-han-sans-korean', 'bold']] // target feature
  ]);
  
  
  
  const targetDongIcon = {
    type: 'FeatureCollection',
    features: features_point.filter(feature => feature.properties.Address_dong === target.properties.Address_dong)
  };

  map.addSource("target_dong_icon", {
    type: 'geojson',
    data: targetDongIcon
  });  

  map.addLayer({
    'id': 'target_dong_icon',
    'type': 'symbol',
    'source': 'target_dong_icon',
    'layout': {
      'icon-allow-overlap': true,
      'icon-image': 'dong_icon',
      'icon-size': {
        type: 'exponential',
          stops: [ 
            [10, 0.03],
            [24, 0.4]
          ]
        },
      'icon-anchor': 'top',
      'icon-offset': [0, -500]
    }
  });    


  // target coord
  var lat = target.properties.Latitude;
  var long = target.properties.Longitude;
  // var coord = [long, lat+0.005];
  var coord = [long, lat+0.002];
  var zoom = target.properties.Zoom;
  var pitch = target.properties.Pitch;
  var bearing = target.properties.Bearing;

  map.flyTo({
    center: coord,
    zoom: zoom,
    pitch: pitch,
    bearing: bearing,
    duration: 2000,
    essential: true
  }); 

  };

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

titleBtn.addEventListener("click", function() {
  currentIndex = -1;
  
  if (map.getLayer('dong_point')) {
    map.removeLayer('dong_point');
  }
  resetLayer();
  initialSetLayers();
  setHome();
});

infoBtn.addEventListener("click", function() {
  document.getElementById("info-popup").style.right = "0";
});

infoXBtn.addEventListener("click", function() {
  const popupWidth = getComputedStyle(document.documentElement).getPropertyValue('--popup_width');  
  document.getElementById("info-popup").style.right = -1.5 * parseInt(popupWidth) + "px";
});
