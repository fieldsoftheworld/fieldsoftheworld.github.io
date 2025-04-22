const IGNORE_PROPS = ['geometry', 'bbox.xmin', 'bbox.xmax', 'bbox.ymin', 'bbox.ymax', 'layer', 'geometry', 'bbox', 'title', 'pmtiles', 'source'];

export function getSelectedFieldBoundary(feature, s2Layers, isCollection) {
  let content = '<div class="field-boundary">';
    const properties = feature.getProperties();

    content += `<h3>${properties.title || properties.id || 'unknown identifier'}</h3>`;
    if (isCollection) {
      content += `<p>`;
      if (properties.pmtiles) {
        content += `<button class="focus-button">Focus on map</button></p>`;
      }
      if (!properties.pmtiles && properties.id !== 'ftw') {
        content += `<span class="no-viz">No visualization available for this dataset.</span>`;
      }
      content += `</p>`;
    }
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
    const selectedYear = getYearFromTimestamp(properties?.determination_datetime?.split('T')?.[0]);
    if (selectedYear) {
      s2Layers.forEach(layer => {
        layer.setVisible(layer.get('title') === selectedYear.toString());
      });
    }
    let sourceLink;
    if (isCollection && properties.source) { 
      sourceLink = properties.source;
    } else if (properties.dataset) {
      sourceLink = `https://source.coop/repositories/kerner-lab/fields-of-the-world-${properties.dataset}/description`; 
    }
    if (sourceLink) {
      content += `<div class="source-link">Source: <a href="${sourceLink}" target="_blank">View Source Data</a></div>`;
    }
    content += '</div>';
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
  const nodes = [];
  for (const feature of features) {
    const properties = feature.getProperties();
    const isCollection = Array.isArray(properties.bbox);
    let content = '';
    // Get the year from the feature
    const year = getYearFromTimestamp(feature.getProperties()?.determination_datetime?.split('T')?.[0]);
      
    // Find and check the corresponding checkbox
    if (year) {
      const checkboxes = document.querySelectorAll('.layer-options input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        if (checkbox.getAttribute('data-year') === year.toString()) {
          checkbox.checked = true;
        } else {
          checkbox.checked = false;
          }
      });
    }

    content = getSelectedFieldBoundary(feature, s2Layers, isCollection);

    const container = document.createElement('section');
    container.innerHTML = content;
    nodes.push(container);
    const focusLink = container.getElementsByClassName("focus-button");
    if (focusLink.length > 0) {
      focusLink[0].addEventListener('click', () => {
        overlay.setPosition(undefined);
        map.getView().fit(feature.getGeometry().getExtent(), { duration: 500 });
      });
    }
  }
  overlay.setPosition(nodes.length > 0 ? event.coordinate : undefined);
  popup.replaceChildren(...nodes);
}

export function handleMapPointerMove(event, map) {
  const hit = map.hasFeatureAtPixel(event.pixel);
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
}

export function handleMapMoveEnd(overlay) {
  overlay.setPosition(undefined);
} 