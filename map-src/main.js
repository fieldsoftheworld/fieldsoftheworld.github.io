import "./style.css";
import { Map, Overlay, View } from "ol";
import TileLayer from 'ol/layer/WebGLTile.js';
import VectorTile from "ol/layer/VectorTile";
import { useGeographic } from 'ol/proj';
import { OSM } from "ol/source";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import LayerSwitcher from "ol-ext/control/LayerSwitcher"
import { PMTilesVectorSource } from "ol-pmtiles";
import Fill from "ol/style/Fill";

const URL = 'https://data.source.coop/kerner-lab/fields-of-the-world/ftw-sources.pmtiles';
const IGNORE_PROPS = ['geometry', 'bbox.xmin', 'bbox.xmax', 'bbox.ymin', 'bbox.ymax', 'layer'];

useGeographic();

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      displayInLayerSwitcher: false,
      source: new OSM()
    })
  ],
  view: new View({
    projection: 'EPSG:3857',
    center: [0, 20],
    zoom: 1
  }),
  controls: [
    new LayerSwitcher({
      show_progress: true,
      extent: true
    })
  ]
});

const fields = new VectorTile({
  declutter: true,
  title: 'FTW Source Data',
  displayInLayerSwitcher: true,
  source: new PMTilesVectorSource({
    url: URL
  }),
  style: new Style({
    stroke: new Stroke({
      color: 'rgb(255, 0, 0)',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0.1)'
    })
  })
});
map.addLayer(fields);

const popup = document.getElementById('popup');
const overlay = new Overlay({
  element: popup,
  positioning: 'bottom-center',
  stopEvent: true,
});
map.addOverlay(overlay);

// Add a click event listener to the map
map.on('click', event => {
  const features = map.getFeaturesAtPixel(event.pixel);
  let content = '';
  for (const feature of features) {
    const properties = feature.getProperties();

    content += `<h3>${properties.title || properties.id || 'unknown identifier'}</h3>`;
    content += `<ul>`;
    for (const key in properties) {
      if (typeof key !== 'undefined' && !IGNORE_PROPS.includes(key)) {

        content += `<li><strong>${key}:</strong> `
        if (Array.isArray(properties[key])) {
          content += properties[key].join(', ');
        }
        else if (typeof properties[key] === 'number') {
          content += properties[key].toLocaleString();
        }
        else {
          content += properties[key];
        }
        content += `</li>`;
      }
    }

    content += '</ul>';
    
  }
  overlay.setPosition(content ? event.coordinate : undefined);
  popup.innerHTML = content;
});

// Change mouse cursor when hovering over features
map.on('pointermove', e => {
  const hit = map.hasFeatureAtPixel(e.pixel);
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
