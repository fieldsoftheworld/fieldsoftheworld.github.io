import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBaselayer } from '../../layers/Baselayer';
import TileLayer from 'ol/layer/WebGLTile';
import { XYZ } from 'ol/source';

describe('Baselayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a WebGLTile layer with correct configuration', () => {
    const layer = createBaselayer();
    expect(layer).toBeDefined();
    expect(layer.getProperties().displayInLayerSwitcher).toBe(false);
    expect(layer.getProperties().title).toBe('Light Base');
    expect(layer.getProperties().source).toBeInstanceOf(XYZ);
    expect(layer.getProperties().source.urls).toContain('https://basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png');
  });
}); 