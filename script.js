/*
This is your site JavaScript code - you can add interactivity and carry out processing
- Initially the JS writes a message to the console, and rotates a button you can add from the README
*/

mapboxgl.accessToken =
  "pk.eyJ1Ijoic3d1LXRlc3QiLCJhIjoiY2tvdG9mdWM1MDV4OTJ2bzdmdnA5ejEyZyJ9.uuSmjrOs4J48Xek-YT6bgw";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/swu-test/cktnuxsl20nix17qowrvldwms",
  center: [126.942, 37.56],
  zoom: 14
});

map.on("load", function() {
  map.resize();
});

  map.on('click', function(e) {

      var states = map.queryRenderedFeatures(e.point, {
          layers: ['test3']
      });
      let was_added = false;


      if (states.length > 0) {
          let pd = document.getElementById('pd1');
          let pd2 = document.getElementById('pd2');

          var image = new Image();
          let imgPastName = states[0].properties.name_en;
          let imgPresentName = states[0].properties.present;
          image.src = './img/past/' + imgPastName + '.png';
          image.style.width = "98%";

          pd.innerHTML = '<h2>' + states[0].properties.name_en + '<br><div style="padding-top:10px">' + states[0].properties.name_ko + '</div></h2>';
          pd2.innerHTML = '<p>' +states[0].properties.info + '</p>';
          streetview.innerHTML = '';


          image.onload = function() {
              pd.appendChild(this);
              streetview.appendChild(panorama);
          //    console.log(imgPresentName);
          }
                } else {
          pd.innerHTML = '<h2>Zoom in and click <br>the buildings to <br>explore a map</h2>';
          pd2.innerHTML = '';
          streetview.innerHTML = '';
      }
  });