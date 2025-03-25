import TileLayer from 'ol/layer/WebGLTile.js';
import { XYZ } from "ol/source";
import LayerGroup from 'ol/layer/Group';

export function createSentinelLayersGroup(map) {
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
  })

  map.addLayer(s2Group);
  return s2Layers
} 