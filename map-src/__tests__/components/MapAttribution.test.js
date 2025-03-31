import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMapAttribution } from '../../components/MapAttribution';

const MockMap = vi.fn();
MockMap.prototype.getTargetElement = vi.fn().mockReturnValue({
  appendChild: vi.fn(),
  id: 'map'
});
MockMap.prototype.querySelectorAll = vi.fn().mockReturnValue([]);

describe('MapAttribution', () => {
  const mockMap = new MockMap();

  beforeEach(() => {
    // Reset DOM mocks
    vi.clearAllMocks();

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
    expect(mockMap.getTargetElement().appendChild).toHaveBeenCalled();
  });
}); 