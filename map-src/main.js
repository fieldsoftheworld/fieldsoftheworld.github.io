import { Map, Overlay, View } from "ol";
import { PMTilesVectorSource } from "ol-pmtiles";
import LayerGroup from 'ol/layer/Group';
import VectorTile from "ol/layer/VectorTile";
import TileLayer from 'ol/layer/WebGLTile.js';
import { useGeographic } from 'ol/proj';
import { XYZ } from "ol/source";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import "./style.css";

const URL = 'https://data.source.coop/kerner-lab/fields-of-the-world/ftw-sources.pmtiles';
const IGNORE_PROPS = ['geometry', 'bbox.xmin', 'bbox.xmax', 'bbox.ymin', 'bbox.ymax', 'layer'];

useGeographic();

const map = new Map({
  target: 'map',
  layers: [new TileLayer({
    displayInLayerSwitcher: false,
    title: 'Light Base',
    source: new XYZ({
      url: 'https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
    })
  })],
  view: new View({
    projection: 'EPSG:3857',
    center: [0, 20],
    zoom: 1
  }),
});

// Create and add legend
function createLegend() {
  const legend = document.createElement('div');
  legend.className = 'map-legend';
  
  const title = document.createElement('div');
  title.className = 'legend-title';
  title.textContent = 'Collection Year';
  legend.appendChild(title);

  // Define colors for different years using ColorBrewer's RdYlBu scheme (colorblind-friendly)
  const yearColors = {
    2024: 'rgb(165, 0, 38)',    // Dark Red
    2023: 'rgb(215, 48, 39)',   // Red
    2022: 'rgb(244, 109, 67)',  // Light Red
    2021: 'rgb(253, 174, 97)',  // Light Yellow
    2020: 'rgb(254, 204, 92)',  // Darker Yellow
    2019: 'rgb(116, 173, 209)', // Darker Blue
    2018: 'rgb(69, 117, 180)',  // Dark Blue
    2017: 'rgb(49, 54, 149)'    // Darkest Blue
  };

  // Add legend items in reverse order (newest to oldest)
  Object.entries(yearColors).reverse().forEach(([year, color]) => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    
    const colorBox = document.createElement('div');
    colorBox.className = 'legend-color';
    colorBox.style.backgroundColor = color;
    
    const label = document.createElement('div');
    label.className = 'legend-label';
    label.textContent = year;
    
    item.appendChild(colorBox);
    item.appendChild(label);
    legend.appendChild(item);
  });

  return legend;
}

// Add legend to map
const legend = createLegend();
map.getTargetElement().appendChild(legend);

const s2Layers = [];
for (const year of [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017]) {
  s2Layers.push(new TileLayer({
    title: `${year}`,
    displayInLayerSwitcher: true,
    visible: false,
    source: new XYZ({
      url: `https://tiles.maps.eox.at/wmts?layer=s2cloudless-${year}_3857&style=default&tilematrixset=GoogleMapsCompatible&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&TileMatrix={z}&TileCol={x}&TileRow={y}`,
    })
  }))
}

const s2Group = new LayerGroup({
  title: 'Sentinel 2',
  layers: s2Layers,
  displayInLayerSwitcher: true
});
map.addLayer(s2Group);

// Create custom layer switcher
function createCustomLayerSwitcher() {
  const container = document.createElement('div');
  container.className = 'custom-layer-switcher';

  // Create Sentinel 2 radio group
  const s2Group = document.createElement('div');
  s2Group.className = 'layer-group';
  s2Group.innerHTML = `
    <div class="group-title">Sentinel 2</div>
    <div class="layer-options">
      ${s2Layers.map((layer, index) => {
        const year = layer.get('title'); // Extract year from title
        return `
          <label>
            <input type="checkbox" name="s2" value="${layer.get('title')}" data-year="${year}">
            <span>${layer.get('title')}</span>
          </label>
        `;
      }).join('')}
    </div>
  `;
  container.appendChild(s2Group);

  container.querySelectorAll('input[name="s2"]').forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        // If checking, uncheck all others first
        container.querySelectorAll('input[name="s2"]').forEach(input => {
          if (input !== e.target) {
            input.checked = false;
          }
        });
        s2Layers.forEach(layer => {
          layer.setVisible(layer.get('title') === e.target.value);
          if (layer.get('title') === e.target.value) {
            // Show attribution for selected layer
            attribution.innerHTML = `Sentinel-2 cloudless - <a href="https://s2maps.eu" target="_blank">https://s2maps.eu</a> by EOX IT Services GmbH (Contains modified Copernicus Sentinel data ${e.target.value})`;
            attribution.style.display = 'block';
          }
        });
      } else {
        // If unchecking, hide all s2 layers and attribution
        s2Layers.forEach(layer => layer.setVisible(false));
        attribution.style.display = 'none';
      }
    });
  });

  return container;
}

// Add custom layer switcher to map
const customSwitcher = createCustomLayerSwitcher();
map.getTargetElement().appendChild(customSwitcher);

const fields = new VectorTile({
  declutter: true,
  title: 'FTW Source Data',
  displayInLayerSwitcher: true,
  source: new PMTilesVectorSource({
    url: URL
  }),
  style: function(feature, resolution) {
    const properties = feature.getProperties();
    const year = getYearFromTimestamp(properties.determination_datetime?.split('T')[0]);
    
    // Define colors for different years using ColorBrewer's RdYlBu scheme (colorblind-friendly)
    const yearColors = {
      2024: 'rgb(165, 0, 38)',    // Dark Red
      2023: 'rgb(215, 48, 39)',   // Red
      2022: 'rgb(244, 109, 67)',  // Light Red
      2021: 'rgb(253, 174, 97)',  // Light Yellow
      2020: 'rgb(254, 204, 92)',  // Darker Yellow
      2019: 'rgb(116, 173, 209)', // Darker Blue
      2018: 'rgb(69, 117, 180)',  // Dark Blue
      2017: 'rgb(49, 54, 149)'    // Darkest Blue
    };

    // Default color if year is not found
    const color = yearColors[year] || 'rgb(128, 128, 128)';

    return new Style({
      stroke: new Stroke({
        color: color,
        width: Math.max(1, resolution/5000)
      }),
      fill: new Fill({
        color: color.replace('rgb', 'rgba').replace(')', ', 0.1)')
      })
    });
  }
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
  if (features.length > 0) {
    getSelectedFieldBoundary(event, features);
    // Get the year from the feature
    const year = getYearFromTimestamp(features[0].getProperties().determination_datetime?.split('T')[0]);
    
    // Find and check the corresponding checkbox
    const checkboxes = document.querySelectorAll('.layer-options input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      if (checkbox.getAttribute('data-year') === year.toString()) {
        checkbox.checked = true;
      } else {
        checkbox.checked = false;
      }
    });
  }
});

// Change mouse cursor when hovering over features
map.on('pointermove', e => {
  const hit = map.hasFeatureAtPixel(e.pixel);
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

map.on('moveend', () => {
  overlay.setPosition(undefined);
});

function getSelectedFieldBoundary(event, features) {
  let content = '';
  for (const feature of features) {
    const properties = feature.getProperties();

    content += `<h3>${properties.title || properties.id || 'unknown identifier'}</h3>`;
    content += `<ul>`;
    for (const key in properties) {
      if (typeof key !== 'undefined' && !IGNORE_PROPS.includes(key)) {
        const displayKey = key === 'determination_datetime' ? 'determination datetime' : key;
        content += `<li><strong>${displayKey}:</strong> `
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
    const selectedYear = getYearFromTimestamp(properties.determination_datetime.split('T')[0]);
    if (selectedYear) {
      s2Layers.forEach(layer => {
        layer.setVisible(layer.get('title') === selectedYear.toString());
      });
    }
  }
  content += `<div class="source-link">Source: <a href="https://source.coop/repositories/kerner-lab/fields-of-the-world-${features[0].getProperties().dataset}/description" target="_blank">View Source Data</a></div>`;

  overlay.setPosition(content ? event.coordinate : undefined);
  popup.innerHTML = content;
}

function getYearFromTimestamp(timestamp) {
  // Handle different timestamp formats
  if (typeof timestamp === 'string') {
    // Try parsing as ISO string
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return date.getFullYear();
    }
  }
  
  return null;
}

// Create attribution element
function createAttribution() {
  const attribution = document.createElement('div');
  attribution.className = 'map-attribution';
  attribution.style.display = 'none';
  return attribution;
}

// Add attribution to map
const attribution = createAttribution();
map.getTargetElement().appendChild(attribution);

// Create CARTO attribution element
function createCartoAttribution() {
  const attribution = document.createElement('div');
  attribution.className = 'carto-attribution';
  attribution.innerHTML = '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a> contributors. &copy; <a href="https://carto.com/attribution" target="_blank">CARTO</a>';
  return attribution;
}

// Add CARTO attribution to map
const cartoAttribution = createCartoAttribution();
map.getTargetElement().appendChild(cartoAttribution);