export function createMapAttribution(map) {
  const attribution = document.createElement('div');
  attribution.className = 'map-attribution';
  attribution.style.display = 'none';
  map.getTargetElement().appendChild(attribution);
  return attribution;
} 