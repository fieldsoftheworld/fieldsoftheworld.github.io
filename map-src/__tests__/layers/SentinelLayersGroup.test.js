import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Map } from 'ol';
import { XYZ } from 'ol/source';
import LayerGroup from 'ol/layer/Group';
import { createSentinelLayersGroup } from '../../layers/SentinelLayersGroup';

const MockMap = vi.fn();
MockMap.prototype.addLayer = vi.fn();
MockMap.prototype.getTargetElement = vi.fn().mockReturnValue({
  appendChild: vi.fn(),
  id: 'map'
});
MockMap.prototype.querySelectorAll = vi.fn().mockReturnValue([]);
describe('SentinelLayersGroup', () => {
  const mockMap = new MockMap();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates Sentinel layers for all years', () => {
    const layers = createSentinelLayersGroup(mockMap);

    expect(layers).toBeDefined();
    expect(layers.length).toBe(8); // 2024-2017
    expect(layers[0].getProperties().title).toBe('2024');
    expect(layers[7].getProperties().title).toBe('2017');
  });

  it('configures each layer correctly', () => {
    const layers = createSentinelLayersGroup(mockMap);
    const layer = layers[0]; // 2024 layer

    expect(layer.getProperties().displayInLayerSwitcher).toBe(true);
    expect(layer.getProperties().visible).toBe(false);
    expect(layer.getProperties().source).toBeInstanceOf(XYZ);
    expect(layer.getProperties().source.urls[0]).toContain('s2cloudless-2024_3857');
  });

  it('creates a layer group with correct configuration', () => {
    createSentinelLayersGroup(mockMap);
    const group = mockMap.addLayer.mock.calls[0][0];

    expect(group).toBeInstanceOf(LayerGroup);
    expect(group.getProperties().title).toBe('Sentinel 2');
    expect(group.getProperties().displayInLayerSwitcher).toBe(true);
    expect(group.getProperties().layers.array_).toHaveLength(8);
  });

  it('adds the layer group to the map', () => {
    createSentinelLayersGroup(mockMap);
    expect(mockMap.addLayer).toHaveBeenCalledTimes(1);
  });
}); 