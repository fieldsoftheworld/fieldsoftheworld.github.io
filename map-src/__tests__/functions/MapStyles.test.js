import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFieldStyle } from '../../functions/MapStyles';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';

// Mock OpenLayers style classes
vi.mock('ol/style/Style', async (importOriginal) => {
  const style = await importOriginal();
  return {
    ...style,
    getFill: vi.fn().mockReturnValue(style.fill),
    getStroke: vi.fn().mockReturnValue(style.stroke)
  };
});

vi.mock('ol/style/Fill', () => ({
  default: vi.fn().mockImplementation((options) => options)
}));

vi.mock('ol/style/Stroke', () => ({
  default: vi.fn().mockImplementation((options) => options)
}));

describe('MapStyles', () => {
  describe('getFieldStyle', () => {
    const mockFeature = {
      getProperties: vi.fn()
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('creates style with correct color for 2024', () => {
      mockFeature.getProperties.mockReturnValue({
        determination_datetime: '2024-03-28T00:00:00'
      });

      const style = getFieldStyle(mockFeature, 5000);
      
      expect(style).toBeInstanceOf(Style);
      expect(style.getFill().color).toBe('rgba(165, 0, 38, 0.1)');
      expect(style.getStroke().color).toBe('rgb(165, 0, 38)');
      expect(style.getStroke().width).toBe(1);
    });

    it('creates style with correct color for 2023', () => {
      mockFeature.getProperties.mockReturnValue({
        determination_datetime: '2023-03-28T00:00:00'
      });

      const style = getFieldStyle(mockFeature, 5000);
      
      expect(style).toBeInstanceOf(Style);
      expect(style.getFill().color).toBe('rgba(215, 48, 39, 0.1)');
      expect(style.getStroke().color).toBe('rgb(215, 48, 39)');
      expect(style.getStroke().width).toBe(1);
    });

    it('uses default color for unknown year', () => {
      mockFeature.getProperties.mockReturnValue({
        determination_datetime: '2010-03-28T00:00:00'
      });

      const style = getFieldStyle(mockFeature, 5000);
      
      expect(style).toBeInstanceOf(Style);
      expect(style.getFill().color).toBe('rgba(128, 128, 128, 0.1)');
      expect(style.getStroke().color).toBe('rgb(128, 128, 128)');
      expect(style.getStroke().width).toBe(1);
    });

    it('adjusts stroke width based on resolution', () => {
      mockFeature.getProperties.mockReturnValue({
        determination_datetime: '2024-03-28T00:00:00'
      });

      const style = getFieldStyle(mockFeature, 10000);
      
      expect(style.getStroke().width).toBe(2);
    });

    it('handles feature without determination_datetime', () => {
      mockFeature.getProperties.mockReturnValue({});

      const style = getFieldStyle(mockFeature, 5000);
      
      expect(style).toBeInstanceOf(Style);
      expect(style.getFill().color).toBe('rgba(128, 128, 128, 0.1)');
      expect(style.getStroke().color).toBe('rgb(128, 128, 128)');
    });
  });
}); 