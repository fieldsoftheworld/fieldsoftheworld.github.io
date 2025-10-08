import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMapPopup } from '../../components/MapPopup';

const MockMap = vi.fn();
MockMap.prototype.getTargetElement = vi.fn().mockReturnValue({
  appendChild: vi.fn(),
  id: 'map'
});
MockMap.prototype.querySelectorAll = vi.fn().mockReturnValue([]);
MockMap.prototype.addOverlay = vi.fn();

describe('MapPopup', () => {
  const mockMap = new MockMap();
  let mockPopup;

  beforeEach(() => {
    // Reset DOM mocks
    vi.clearAllMocks();

    // Mock popup element
    mockPopup = {
      id: 'popup',
      classList: {
        add: vi.fn(),
        contains: vi.fn().mockReturnValue(true)
      },
      style: {},
      appendChild: vi.fn(),
      removeChild: vi.fn(),
      innerHTML: '',
      getAttribute: vi.fn(),
      setAttribute: vi.fn(),
      querySelector: vi.fn(),
      querySelectorAll: vi.fn().mockReturnValue([])
    };

    // Mock document methods
    document.getElementById = vi.fn().mockReturnValue(mockPopup);
  });

  it('creates popup with correct structure', () => {
    const { popup, overlay } = createMapPopup(mockMap);

    expect(popup).toBeDefined();
    expect(overlay).toBeDefined();
    expect(overlay.getElement()).toBe(mockPopup);
    expect(overlay.getPositioning()).toBe('bottom-center');
    expect(overlay.stopEvent).toBe(true);
  });

  it('adds overlay to map', () => {
    const { overlay } = createMapPopup(mockMap);
    expect(mockMap.addOverlay).toHaveBeenCalledWith(overlay);
  });
}); 