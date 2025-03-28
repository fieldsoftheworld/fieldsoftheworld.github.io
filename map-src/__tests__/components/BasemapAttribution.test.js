import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createBaseMapAttribution } from '../../components/BasemapAttribution';
import Map from 'ol/Map';

describe('BasemapAttribution', () => {
  const mockMap = new Map();
  let mockContainer;

  beforeEach(() => {
    // Reset DOM mocks
    vi.clearAllMocks();

    // Mock DOM elements
    mockContainer = {
      appendChild: vi.fn()
    };

    // Mock document methods
    document.createElement = vi.fn().mockImplementation((tagName) => ({
      className: '',
      innerHTML: ''
    }));
  });

  it('creates basemap attribution with correct structure', () => {
    createBaseMapAttribution(mockMap);

    expect(mockContainer.appendChild).toHaveBeenCalled();
    const attribution = mockContainer.appendChild.mock.calls[0][0];
    expect(attribution.className).toBe('basemap-attribution');
    expect(attribution.innerHTML).toContain('OpenStreetMap');
    expect(attribution.innerHTML).toContain('CARTO');
  });

  it('adds attribution to map container', () => {
    createBaseMapAttribution(mockMap);
    expect(mockContainer.appendChild).toHaveBeenCalled();
  });
}); 