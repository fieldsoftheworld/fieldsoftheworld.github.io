export function createBaseMapAttribution(map) {
  const attribution = document.createElement('div');
  attribution.className = 'basemap-attribution';
  attribution.innerHTML = '<a href="https://openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributers. © <a href="https://carto.com/attribution" target="_blank">CARTO</a>';
  map.getTargetElement().appendChild(attribution);
} 