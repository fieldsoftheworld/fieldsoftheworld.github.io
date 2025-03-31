import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createLegend } from '../../components/MapLegend';

const MockMap = vi.fn();
MockMap.prototype.getTargetElement = vi.fn().mockReturnValue({
  appendChild: vi.fn(),
  id: 'map'
});
MockMap.prototype.querySelectorAll = vi.fn().mockReturnValue([]);

describe('MapLegend', () => {
  const mockMap = new MockMap();
  let mockColors = [];
  let mockYears = [];
  let currentIndex = 0;

  beforeEach(() => {
    // Reset DOM mocks
    vi.clearAllMocks();
    currentIndex = 0;

    // Initialize mock colors and years
    mockColors = [
      'rgb(165, 0, 38)',   // 2024
      'rgb(215, 48, 39)',  // 2023
      'rgb(244, 109, 67)', // 2022
      'rgb(253, 174, 97)', // 2021
      'rgb(254, 224, 144)', // 2020
      'rgb(255, 255, 191)', // 2019
      'rgb(224, 243, 248)', // 2018
      'rgb(49, 54, 149)'    // 2017
    ];
    mockYears = ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'];

    // Mock document methods
    document.createElement = vi.fn().mockImplementation((tagName) => ({
      className: '',
      appendChild: vi.fn(),
      style: {},
      querySelector: vi.fn().mockImplementation((selector) => {
        if (selector === '.legend-color') {
          return { 
            style: { 
              backgroundColor: mockColors[currentIndex]
            } 
          };
        }
        if (selector === '.legend-label') {
          return { 
            textContent: mockYears[currentIndex]
          };
        }
        return null;
      })
    }));
  });

  it('creates legend with correct structure', () => {
    createLegend(mockMap);

    expect(mockMap.getTargetElement().appendChild).toHaveBeenCalled();
    const legend = mockMap.getTargetElement().appendChild.mock.calls[0][0];
    expect(legend.className).toBe('map-legend');
  });

  it('creates legend title', () => {
    createLegend(mockMap);

    const legend = mockMap.getTargetElement().appendChild.mock.calls[0][0];
    const title = legend.appendChild.mock.calls[0][0];
    expect(title.className).toBe('legend-title');
    expect(title.textContent).toBe('Collection Year');
  });

  it('creates legend items for all years', () => {
    createLegend(mockMap);

    const legend = mockMap.getTargetElement().appendChild.mock.calls[0][0];
    // Should have 8 items (2024-2017)
    expect(legend.appendChild.mock.calls.length).toBe(9); // 8 items + 1 title
  });

  it('creates legend items with correct colors', () => {
    createLegend(mockMap);

    const legend = mockMap.getTargetElement().appendChild.mock.calls[0][0];
    const items = legend.appendChild.mock.calls.slice(1); // Skip title

    // Check all items
    items.forEach((item, index) => {
      currentIndex = index; // Update the current index for the mock
      const legendItem = item[0];
      expect(legendItem.className).toBe('legend-item');
      
      const color = legendItem.querySelector('.legend-color');
      expect(color.style.backgroundColor).toBe(mockColors[index]);
      
      const label = legendItem.querySelector('.legend-label');
      expect(label.textContent).toBe(mockYears[index]);
    });
  });

  it('adds legend to map container', () => {
    createLegend(mockMap);
    expect(mockMap.getTargetElement().appendChild).toHaveBeenCalled();
  });
}); 