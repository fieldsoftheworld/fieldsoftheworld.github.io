import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFieldStyle } from '../../functions/MapStyles';
import Style from 'ol/style/Style';

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