import { Map, View } from "ol";
import { useGeographic } from 'ol/proj';
import { createBaseMapAttribution } from './components/BasemapAttribution.js';
import { createCustomLayerSwitcher } from './components/LayerSwitcher.js';
import { createMapAttribution } from './components/MapAttribution.js';
import { createLegend } from './components/MapLegend.js';
import { createMapPopup } from './components/MapPopup.js';
import { handleMapClick, handleMapMoveEnd, handleMapPointerMove } from './functions/MapUtils.js';
import { createFieldsOfTheWorldLayer } from './layers/FieldsOfTheWorldLayer.js';
import { createSentinelLayersGroup } from './layers/SentinelLayersGroup.js';
import { createBaselayer } from './layers/Baselayer.js';
import "./style.css";

useGeographic();

const map = new Map({
  target: 'map',
  layers: [createBaselayer()],
  view: new View({
    projection: 'EPSG:3857',
    center: [0, 20],
    zoom: 1
  }),
});
// Add layers to map
const s2Layers = createSentinelLayersGroup(map);
createFieldsOfTheWorldLayer(map);

// Add legend to map
createLegend(map);

// Create popup and overlay
const { popup, overlay } = createMapPopup(map);

// Add event listeners to the map
map.on('click', event => handleMapClick(event, map, s2Layers, overlay, popup));
map.on('pointermove', event => handleMapPointerMove(event, map));
map.on('moveend', () => handleMapMoveEnd(overlay));

// Create attribution elements
const attribution = createMapAttribution(map);
createBaseMapAttribution(map);

// Add custom layer switcher to map
createCustomLayerSwitcher(s2Layers, attribution, map);
