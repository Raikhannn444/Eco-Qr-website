
function initMap() {
  var map = L.map('map').setView([43.238949, 76.889709], 12); // Алматы

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([43.238949, 76.889709]).addTo(map)
    .bindPopup('Пункт приёма пластика')
    .openPopup();
}
window.onload = initMap;
