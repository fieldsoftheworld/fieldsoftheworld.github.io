import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createLegend } from '../../components/MapLegend';
import Map from 'ol/Map';

describe('MapLegend', () => {
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
      appendChild: vi.fn(),
      style: {}
    }));
  });

  it('creates legend with correct structure', () => {
    createLegend(mockMap);

    expect(mockContainer.appendChild).toHaveBeenCalled();
    const legend = mockContainer.appendChild.mock.calls[0][0];
    expect(legend.className).toBe('map-legend');
  });

  it('creates legend title', () => {
    createLegend(mockMap);

    const legend = mockContainer.appendChild.mock.calls[0][0];
    const title = legend.appendChild.mock.calls[0][0];
    expect(title.className).toBe('legend-title');
    expect(title.textContent).toBe('Collection Year');
  });

  it('creates legend items for all years', () => {
    createLegend(mockMap);

    const legend = mockContainer.appendChild.mock.calls[0][0];
    // Should have 8 items (2024-2017)
    expect(legend.appendChild.mock.calls.length).toBe(9); // 8 items + 1 title
  });

  it('creates legend items with correct colors', () => {
    createLegend(mockMap);

    const legend = mockContainer.appendChild.mock.calls[0][0];
    const items = legend.appendChild.mock.calls.slice(1); // Skip title

    // Check first and last items
    const firstItem = items[0][0];
    expect(firstItem.className).toBe('legend-item');
    expect(firstItem.querySelector('.legend-color').style.backgroundColor).toBe('rgb(49, 54, 149)'); // 2017
    expect(firstItem.querySelector('.legend-label').textContent).toBe('2017');

    const lastItem = items[7][0];
    expect(lastItem.className).toBe('legend-item');
    expect(lastItem.querySelector('.legend-color').style.backgroundColor).toBe('rgb(165, 0, 38)'); // 2024
    expect(lastItem.querySelector('.legend-label').textContent).toBe('2024');
  });

  it('adds legend to map container', () => {
    createLegend(mockMap);
    expect(mockContainer.appendChild).toHaveBeenCalled();
  });
}); 