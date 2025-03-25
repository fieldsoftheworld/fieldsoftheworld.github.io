export function createLegend(map) {
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

  map.getTargetElement().appendChild(legend);
} 