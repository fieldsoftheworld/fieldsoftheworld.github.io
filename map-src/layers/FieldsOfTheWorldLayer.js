import VectorTile from "ol/layer/VectorTile";
import { PMTilesVectorSource } from "ol-pmtiles";
import { getFieldStyle } from '../functions/MapStyles.js';

const url = 'https://data.source.coop/kerner-lab/fields-of-the-world/ftw-sources.pmtiles';

export function createFieldsOfTheWorldLayer(map) {
  const fields = new VectorTile({
    declutter: true,
    title: 'FTW Source Data',
    displayInLayerSwitcher: true,
    source: new PMTilesVectorSource({
      url: url
    }),
    style: getFieldStyle
  });
  map.addLayer(fields);
  return fields;
} 