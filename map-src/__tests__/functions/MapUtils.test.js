import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getSelectedFieldBoundary, 
  getYearFromTimestamp, 
  handleMapClick, 
  handleMapPointerMove, 
  handleMapMoveEnd 
} from '../../functions/MapUtils';

// Mock document methods
vi.stubGlobal('document', {
  querySelectorAll: vi.fn().mockReturnValue([
    {
      getAttribute: vi.fn().mockReturnValue('2024'),
      checked: false,
      setAttribute: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    },
    {
      getAttribute: vi.fn().mockReturnValue('2023'),
      checked: false,
      setAttribute: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }
  ])
});

describe('MapUtils', () => {
  describe('getYearFromTimestamp', () => {
    it('returns year from valid ISO date string', () => {
      expect(getYearFromTimestamp('2024-03-28')).toBe(2024);
    });

    it('returns null for invalid date string', () => {
      expect(getYearFromTimestamp('invalid-date')).toBeNull();
    });

    it('returns null for non-string input', () => {
      expect(getYearFromTimestamp(null)).toBeNull();
      expect(getYearFromTimestamp(undefined)).toBeNull();
      expect(getYearFromTimestamp(2024)).toBeNull();
    });
  });

  describe('getSelectedFieldBoundary', () => {
    const mockEvent = {
      coordinate: [0, 0]
    };

    const mockFeatures = [{
      getProperties: vi.fn().mockReturnValue({
        title: 'Test Field',
        determination_datetime: '2024-03-28T00:00:00',
        dataset: 'test-dataset',
        area: 1000
      })
    }];

    const mockS2Layers = [
      { setVisible: vi.fn(), get: vi.fn().mockReturnValue('2024') },
      { setVisible: vi.fn(), get: vi.fn().mockReturnValue('2023') }
    ];

    const mockOverlay = {
      setPosition: vi.fn()
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('generates content with field properties', () => {
      const content = getSelectedFieldBoundary(mockEvent, mockFeatures, mockS2Layers, mockOverlay);
      
      expect(content).toContain('<h3>Test Field</h3>');
      expect(content).toContain('<li><strong>area:</strong> 1,000</li>');
      expect(content).toContain('<li><strong>determination datetime:</strong> 2024-03-28T00:00:00</li>');
      expect(content).toContain('View Source Data');
    });

    it('handles features without title', () => {
      const featuresWithoutTitle = [{
        getProperties: vi.fn().mockReturnValue({
          id: '123',
          determination_datetime: '2024-03-28T00:00:00',
          dataset: 'test-dataset'
        })
      }];

      const content = getSelectedFieldBoundary(mockEvent, featuresWithoutTitle, mockS2Layers, mockOverlay);
      expect(content).toContain('<h3>123</h3>');
    });

    it('updates layer visibility based on year', () => {
      getSelectedFieldBoundary(mockEvent, mockFeatures, mockS2Layers, mockOverlay);
      
      expect(mockS2Layers[0].setVisible).toHaveBeenCalledWith(true);
      expect(mockS2Layers[1].setVisible).toHaveBeenCalledWith(false);
    });

    it('handles empty features array', () => {
      const content = getSelectedFieldBoundary(mockEvent, [], mockS2Layers, mockOverlay);
      expect(content).toBe('');
      expect(mockOverlay.setPosition).toHaveBeenCalledWith(undefined);
    });
  });

  describe('handleMapClick', () => {
    const mockEvent = {
      pixel: [100, 100],
      coordinate: [0, 0]
    };

    const mockMap = {
      getFeaturesAtPixel: vi.fn().mockReturnValue([{
        getProperties: vi.fn().mockReturnValue({
          determination_datetime: '2024-03-28T00:00:00'
        })
      }])
    };

    const mockS2Layers = [
      { setVisible: vi.fn(), get: vi.fn().mockReturnValue('2024') },
      { setVisible: vi.fn(), get: vi.fn().mockReturnValue('2023') }
    ];

    const mockOverlay = {
      setPosition: vi.fn()
    };

    const mockPopup = {
      innerHTML: ''
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('handles click with features', () => {
      handleMapClick(mockEvent, mockMap, mockS2Layers, mockOverlay, mockPopup);
      
      expect(mockPopup.innerHTML).toBeDefined();
      expect(mockPopup.innerHTML).toContain('View Source Data');
    });

    it('handles click without features', () => {
      mockMap.getFeaturesAtPixel.mockReturnValue([]);
      handleMapClick(mockEvent, mockMap, mockS2Layers, mockOverlay, mockPopup);
      
      expect(mockPopup.innerHTML).toBe('');
      expect(mockOverlay.setPosition).toHaveBeenCalledWith(undefined);
    });
  });

  describe('handleMapPointerMove', () => {
    const mockEvent = {
      pixel: [100, 100]
    };

    const mockMap = {
      hasFeatureAtPixel: vi.fn(),
      getTargetElement: vi.fn().mockReturnValue({
        style: {}
      })
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('sets cursor to pointer when feature is present', () => {
      mockMap.hasFeatureAtPixel.mockReturnValue(true);
      handleMapPointerMove(mockEvent, mockMap);
      
      expect(mockMap.getTargetElement().style.cursor).toBe('pointer');
    });

    it('clears cursor when no feature is present', () => {
      mockMap.hasFeatureAtPixel.mockReturnValue(false);
      handleMapPointerMove(mockEvent, mockMap);
      
      expect(mockMap.getTargetElement().style.cursor).toBe('');
    });
  });

  describe('handleMapMoveEnd', () => {
    const mockOverlay = {
      setPosition: vi.fn()
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('clears overlay position', () => {
      handleMapMoveEnd(mockOverlay);
      expect(mockOverlay.setPosition).toHaveBeenCalledWith(undefined);
    });
  });
}); 