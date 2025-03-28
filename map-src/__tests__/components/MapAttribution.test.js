import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMapAttribution } from '../../components/MapAttribution';
import Map from 'ol/Map';

describe('MapAttribution', () => {
  const mockMap = new Map();
  let mockContainer;

  beforeEach(() => {
    // Reset DOM mocks
    vi.clearAllMocks();

    // Mock DOM elements
    mockContainer = {
      appendChild: vi.fn(),
      id: 'map'
    };

    // Mock document methods
    document.createElement = vi.fn().mockImplementation((tagName) => ({
      className: '',
      style: { display: 'none' }
    }));
  });

  it('creates attribution element with correct structure', () => {
    const attribution = createMapAttribution(mockMap);

    expect(attribution).toBeDefined();
    expect(attribution.className).toBe('map-attribution');
    expect(attribution.style.display).toBe('none');
  });

  it('adds attribution to map container', () => {
    createMapAttribution(mockMap);
    expect(mockContainer.appendChild).toHaveBeenCalled();
  });
}); 