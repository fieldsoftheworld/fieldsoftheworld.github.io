import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMapPopup } from '../../components/MapPopup';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';

describe('MapPopup', () => {
  const mockMap = new Map();
  let mockPopup;
  let mockOverlay;

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
    // Mock overlay
    mockOverlay = {
      getElement: vi.fn().mockReturnValue(mockPopup),
      getPositioning: vi.fn().mockReturnValue('bottom-center'),
      getStopEvent: vi.fn().mockReturnValue(true),
      setPosition: vi.fn()
    };

    // Mock Overlay constructor
    vi.mocked(Overlay).mockImplementation(() => mockOverlay);
  });

  it('creates popup with correct structure', () => {
    const { popup, overlay } = createMapPopup(mockMap);

    expect(popup).toBeDefined();
    expect(overlay).toBeDefined();
    expect(overlay.getElement()).toBe(mockPopup);
    expect(overlay.getPositioning()).toBe('bottom-center');
    expect(overlay.getStopEvent()).toBe(true);
  });

  it('adds overlay to map', () => {
    createMapPopup(mockMap);
    expect(mockMap.addOverlay).toHaveBeenCalledWith(mockOverlay);
  });
}); 