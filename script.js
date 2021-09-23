/*
This is your site JavaScript code - you can add interactivity and carry out processing
- Initially the JS writes a message to the console, and rotates a button you can add from the README
*/

    mapboxgl.accessToken = 'pk.eyJ1Ijoic3d1LXRlc3QiLCJhIjoiY2tvdG9mdWM1MDV4OTJ2bzdmdnA5ejEyZyJ9.uuSmjrOs4J48Xek-YT6bgw';

    const map = new mapboxgl.Map({
      container: 'mapContainer',
      style: 'mapbox://styles/swu-test/cktnuxsl20nix17qowrvldwms',
      center: [126.951073, 37.548930],
      maxZoom: 15.5,
      minZoom: 13,
      pitch: 0
    });

    map.on('load', function () {
    map.resize();
});