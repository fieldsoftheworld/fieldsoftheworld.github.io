export function createCustomLayerSwitcher(s2Layers, attribution, map) {
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

  // Create fiboa toggle
  const fiboaGroup = document.createElement('div');
  fiboaGroup.className = 'layer-group';
  fiboaGroup.innerHTML = `
    <div class="group-title">Fiboa</div>
    <div class="layer-options">
      <label>
        <input type="checkbox" name="fiboa" value="fiboa" checked>
        <span>Field Boundaries</span>
      </label>
    </div>
  `;
  container.appendChild(fiboaGroup);

  // Create Fields of the World toggle
  const ftwGroup = document.createElement('div');
  ftwGroup.className = 'layer-group';
  ftwGroup.innerHTML = `
    <div class="group-title">Fields of the World</div>
    <div class="layer-options">
      <label>
        <input type="checkbox" name="ftw" value="ftw" checked>
        <span>Field Boundaries</span>
      </label>
    </div>
  `;
  container.appendChild(ftwGroup);

  // Handle Sentinel 2 layer toggles
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

  const fiboaLayers = map.getLayers().getArray().filter(layer => 
    layer.get('title') && layer.get('title').toLowerCase().includes('fiboa')
  );

  const ftwLayers = map.getLayers().getArray().filter(layer => 
    layer.get('title') && layer.get('title').toLowerCase().includes('ftw')
  );

  // Handle fiboa layer toggle
  container.querySelector('input[name="fiboa"]').addEventListener('change', (e) => {
    fiboaLayers.forEach(layer => layer.setVisible(e.target.checked));
  });

  // Handle Fields of the World layer toggle
  container.querySelector('input[name="ftw"]').addEventListener('change', (e) => {
    ftwLayers.forEach(layer => layer.setVisible(e.target.checked));
  });

  // Set initial visibility for fiboa and ftw layers
  fiboaLayers.forEach(layer => layer.setVisible(true));
  ftwLayers.forEach(layer => layer.setVisible(true));

  map.getTargetElement().appendChild(container);
} 