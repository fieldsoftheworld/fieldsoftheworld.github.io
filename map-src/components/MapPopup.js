import Overlay from "ol/Overlay";

export function createMapPopup(map) {
  const popup = document.getElementById('popup');
  const overlay = new Overlay({
    element: popup,
    positioning: 'bottom-center',
    stopEvent: true,
  });

  map.addOverlay(overlay);

  return {
    popup,
    overlay
  };
} 