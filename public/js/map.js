mapboxgl.accessToken = mapToken;
const coordinates = JSON.parse(document.getElementById('coordinates').textContent);

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // map style
  center: coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .addTo(map);           