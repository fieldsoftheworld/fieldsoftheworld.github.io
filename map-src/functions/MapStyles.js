import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import { getYearFromTimestamp } from './MapUtils.js';

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

export function getFieldStyle(feature, resolution) {
  const properties = feature.getProperties();
  const year = getYearFromTimestamp(properties.determination_datetime?.split('T')[0]);
  
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