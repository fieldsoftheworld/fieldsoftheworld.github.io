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
  map.getTargetElement().appendChild(container);
} 