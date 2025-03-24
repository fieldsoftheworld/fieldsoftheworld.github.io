import { XYZ } from "ol/source";
import TileLayer from 'ol/layer/WebGLTile.js';

export function createBaselayer() {
    return new TileLayer({
        displayInLayerSwitcher: false,
        title: 'Light Base',
        source: new XYZ({
          url: 'https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
        })
      })
}