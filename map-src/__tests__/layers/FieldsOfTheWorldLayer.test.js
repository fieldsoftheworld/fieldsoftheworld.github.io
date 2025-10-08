import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFieldsOfTheWorldLayer } from '../../layers/FieldsOfTheWorldLayer';

const MockMap = vi.fn();
MockMap.prototype.addLayer = vi.fn();
MockMap.prototype.getTargetElement = vi.fn().mockReturnValue({
  appendChild: vi.fn(),
  id: 'map'
});
MockMap.prototype.querySelectorAll = vi.fn().mockReturnValue([]);

describe('FieldsOfTheWorldLayer', () => {
  const mockMap = new MockMap();
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a VectorTile layer with correct configuration', () => {
    const layer = createFieldsOfTheWorldLayer(mockMap);

    expect(layer).toBeDefined();
    expect(layer.getProperties().declutter).toBe(true);
    expect(layer.getProperties().title).toBe('FTW Source Data');
    expect(layer.getProperties().displayInLayerSwitcher).toBe(true);
    expect(layer.getProperties().source.urls[0]).toBe('pmtiles://{z}/{x}/{y}');
    expect(layer.getStyle()).toBeDefined();
  });

  it('adds the layer to the map', () => {
    const layer = createFieldsOfTheWorldLayer(mockMap);
    expect(mockMap.addLayer).toHaveBeenCalledWith(layer);
  });
}); 