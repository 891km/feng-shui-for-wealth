 
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


let hoveredPolygonId = null; 
map.on("load", () => {
  
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
        'case', ['boolean', ['feature-state', 'hover'], false], 1, 0.5
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
  
  
//   // 마우스오버하면 마우스 포인터 모양 바뀜
//   map.on("mouseenter", "dong_polygon", (e) => {
//     map.getCanvas().style.cursor = "pointer";
//     // map.setPaintProperty('dong_fill', 'fill-color', 'rgba(255, 0, 0, 0)');
//   });

//   // 마우스가 이동하면 원래 마우스 모양으로 바뀜
//   map.on("mouseleave", "dong_polygon", (e) => {
//     map.getCanvas().style.cursor = "";
//   });


  // When the user moves their mouse over the state-fill layer, we'll update the
  // feature state for the feature under the mouse.
  map.on('mousemove', 'dong_polygon', (e) => {
    if (e.features.length > 0) {
      if (hoveredPolygonId !== null) {
        map.setFeatureState(
          { source: 'dong_polygon', id: hoveredPolygonId },
          { hover: false }
        );
      }
      hoveredPolygonId = e.features[0].index;
      map.setFeatureState(
        { source: 'dong_polygon', id: hoveredPolygonId },
        { hover: true }
      );
    }
  });

  // When the mouse leaves the state-fill layer, update the feature state of the
  // previously hovered feature.
  map.on('mouseleave', 'dong_polygon', () => {
    if (hoveredPolygonId !== null) {
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


function targetByIndex(currentIndex) {
  const features = map.querySourceFeatures('dong_polygon');
  const targetFeature = features.find(feature => feature.properties.Index === currentIndex);
  return targetFeature;
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
  
  
  var lat = target.properties.Latitude;
  var long = target.properties.Longitude;
  // var pos = JSON.parse(target.properties.Pos);
  var coord = [long, lat];
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


map.on("click", "dong_polygon", e => {
  target = e.features[0];
  currentIndex = (target.properties.Index);
  
  loadTargetInfo(target);

});

leftBtn.addEventListener("click", function() {
  currentIndex = ((currentIndex - 1 + 15) % 15);
  target = targetByIndex(currentIndex);
  console.log(currentIndex, target) // error

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


