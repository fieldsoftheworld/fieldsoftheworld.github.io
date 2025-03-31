import { createMapAttribution } from '../components/MapAttribution';

const IGNORE_PROPS = ['geometry', 'bbox.xmin', 'bbox.xmax', 'bbox.ymin', 'bbox.ymax', 'layer'];

export function getSelectedFieldBoundary(event, features, s2Layers, overlay, attribution) {
  if (!features || features.length === 0) {
    overlay.setPosition(undefined);
    return '';
  }

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
        attribution.innerHTML = `Sentinel-2 cloudless - <a href="https://s2maps.eu" target="_blank">https://s2maps.eu</a> by EOX IT Services GmbH (Contains modified Copernicus Sentinel data ${selectedYear})`;
        attribution.style.display = 'block';
      });
    }
  }

  content += `<div class="source-link">Source: <a href="https://source.coop/repositories/kerner-lab/fields-of-the-world-${features[0].getProperties().dataset}/description" target="_blank">View Source Data</a></div>`;

  overlay.setPosition(content ? event.coordinate : undefined);
  return content;
}

export function getYearFromTimestamp(timestamp) {
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

export function handleMapClick(event, map, s2Layers, overlay, popup) {
  const features = map.getFeaturesAtPixel(event.pixel);
  if (features.length > 0) {
    const attribution = createMapAttribution(map);
    const content = getSelectedFieldBoundary(event, features, s2Layers, overlay, attribution);
    popup.innerHTML = content;
    
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
  } else {
    // Clear popup content and overlay position when no features are found
    popup.innerHTML = '';
    overlay.setPosition(undefined);
  }
}

export function handleMapPointerMove(event, map) {
  const hit = map.hasFeatureAtPixel(event.pixel);
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
}

export function handleMapMoveEnd(overlay) {
  overlay.setPosition(undefined);
} 