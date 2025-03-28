import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFieldsOfTheWorldLayer } from '../../layers/FieldsOfTheWorldLayer';
import { Map } from 'ol';

describe('FieldsOfTheWorldLayer', () => {
  const mockMap = new Map()
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a VectorTile layer with correct configuration', () => {
    const layer = createFieldsOfTheWorldLayer(mockMap);

    expect(layer).toBeDefined();
    expect(layer.getProperties().declutter).toBe(true);
    expect(layer.getProperties().title).toBe('FTW Source Data');
    expect(layer.getProperties().displayInLayerSwitcher).toBe(true);
    expect(layer.getProperties().source.url).toBe('https://data.source.coop/kerner-lab/fields-of-the-world/ftw-sources.pmtiles');
    expect(layer.getProperties().style).toBeDefined();
  });

  it('adds the layer to the map', () => {
    const layer = createFieldsOfTheWorldLayer(mockMap);
    expect(mockMap.addLayer).toHaveBeenCalledWith(layer);
  });
}); 