import { Feature } from "ol";
import { PMTilesVectorSource } from "ol-pmtiles";
import { fromExtent } from "ol/geom/Polygon";
import VectorLayer from "ol/layer/Vector";
import Vector from "ol/source/Vector";
import VectorTile from "ol/layer/VectorTile";
import Style from "ol/style/Style";
import collections from '../sources.js';
import { Fill, Stroke } from "ol/style";
import { getFieldStyle } from '../functions/MapStyles.js';

const minZoom = 7;
const bboxStroke = new Stroke({
    color: 'rgb(0, 0, 0)',
    width: 1
  });
  const bboxRedStroke = new Stroke({
    color: 'rgb(255, 0, 0)',
    width: 1
  });
  const bboxFill = new Fill({
    color: 'rgba(0, 0, 0, 0.1)'
  });
  const fieldStyle = new Style({
    stroke: new Stroke({
      color: 'rgb(0, 165, 255)',
      width: 1
    }),
    fill: new Fill({
      color: 'rgba(0, 165, 255, 0.1)'
    })
  });

export function createFiboaLayer(map) {
    let count = 0;
    for (const c of collections) {
    const bboxes = c.bbox.length > 1 ? c.bbox.slice(1) : c.bbox;

    const features = [];
    for (const bbox of bboxes) {
        const feature = new Feature(fromExtent(bbox));
        feature.setProperties(c);
        features.push(feature);
    }
    const bboxLayer = new VectorLayer({
        title: c.title,
        displayInLayerSwitcher: false,
        maxZoom: c.pmtiles || c.id === 'ftw' ? minZoom : undefined,
        source: new Vector({ features }),
        style: new Style({
        stroke: c.pmtiles || c.id === 'ftw' ? bboxStroke : bboxRedStroke,
        fill: bboxFill
        })
    });
    map.addLayer(bboxLayer);

    if (c.count > 0) {
        count += c.count;
    }

    if (c.pmtiles) {
        const options = {
        url: c.pmtiles
        };
        if (c.attribution) {
        options.attributions = [c.attribution];
        }
        const fields = new VectorTile({
          declutter: true,
          title: c.title,
          minZoom,
          displayInLayerSwitcher: true,
          source: new PMTilesVectorSource(options),
          style: getFieldStyle
        });
        map.addLayer(fields);
    }
    }
}