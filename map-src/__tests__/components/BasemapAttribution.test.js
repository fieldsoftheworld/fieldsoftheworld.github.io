import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBaseMapAttribution } from '../../components/BasemapAttribution';

const MockMap = vi.fn();
MockMap.prototype.getTargetElement = vi.fn().mockReturnValue({
  appendChild: vi.fn(),
  id: 'map'
});

describe('BasemapAttribution', () => {
  const mockMap = new MockMap();

  beforeEach(() => {
    // Reset DOM mocks
    vi.clearAllMocks();
  });

  it('creates basemap attribution with correct structure', () => {
    createBaseMapAttribution(mockMap);

    expect(mockMap.getTargetElement().appendChild).toHaveBeenCalled();
    const attribution = mockMap.getTargetElement().appendChild.mock.calls[0][0];
    expect(attribution.className).toBe('basemap-attribution');
    expect(attribution.innerHTML).toContain('OpenStreetMap');
    expect(attribution.innerHTML).toContain('CARTO');
  });

  it('adds attribution to map container', () => {
    createBaseMapAttribution(mockMap);
    expect(mockMap.getTargetElement().appendChild).toHaveBeenCalled();
  });
}); 