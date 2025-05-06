import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCustomLayerSwitcher } from '../../components/LayerSwitcher';

const MockMap = vi.fn();
MockMap.prototype.getTargetElement = vi.fn().mockReturnValue({
  appendChild: vi.fn(),
  id: 'map'
});
MockMap.prototype.querySelectorAll = vi.fn().mockReturnValue([]);

describe('LayerSwitcher', () => {
  const mockMap = new MockMap();
  let mockS2Layers;
  let mockContainer;

  beforeEach(() => {
    // Reset DOM mocks
    vi.clearAllMocks();

    // Mock container element
    mockContainer = {
      appendChild: vi.fn(),
      querySelectorAll: vi.fn().mockReturnValue([]),
      id: 'custom-layer-switcher',
      className: 'layer-group'
    };

    // Mock document methods
    document.createElement = vi.fn().mockReturnValue(mockContainer);
    document.getElementById = vi.fn().mockReturnValue(mockContainer);

    // Mock S2 layers
    mockS2Layers = [
      { get: vi.fn().mockReturnValue('2024'), setVisible: vi.fn() },
      { get: vi.fn().mockReturnValue('2023'), setVisible: vi.fn() }
    ];
  });

  it('creates layer switcher with correct structure', () => {
    const mockCheckboxes = [
      { addEventListener: vi.fn(), value: '2024', checked: false },
      { addEventListener: vi.fn(), value: '2023', checked: false }
    ];
    mockContainer.querySelectorAll = vi.fn().mockReturnValue(mockCheckboxes);

    createCustomLayerSwitcher(mockS2Layers, mockMap);

    expect(mockMap.getTargetElement().appendChild).toHaveBeenCalled();
    const container = mockMap.getTargetElement().appendChild.mock.calls[0][0];
    expect(container.id).toBe('custom-layer-switcher');
    expect(container.className).toBe('layer-group');
    
    // Check that the layer group was created
    const layerGroup = container.appendChild.mock.calls[0][0];
    expect(layerGroup.className).toBe('layer-group');
  });

  it('creates checkboxes for each layer', () => {
    const mockCheckboxes = [
      { addEventListener: vi.fn(), value: '2024', checked: false },
      { addEventListener: vi.fn(), value: '2023', checked: false }
    ];

    mockContainer.querySelectorAll = vi.fn().mockReturnValue(mockCheckboxes);
    createCustomLayerSwitcher(mockS2Layers, mockMap);

    expect(mockContainer.querySelectorAll).toHaveBeenCalledWith('input[name="s2"]');
    expect(mockCheckboxes[0].addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
    expect(mockCheckboxes[1].addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('handles layer visibility changes', () => {
    const mockCheckbox = {
      addEventListener: vi.fn(),
      value: '2024',
      checked: true
    };

    mockContainer.querySelectorAll = vi.fn().mockReturnValue([mockCheckbox]);
    createCustomLayerSwitcher(mockS2Layers, mockMap);

    // Simulate checkbox change event
    const changeHandler = mockCheckbox.addEventListener.mock.calls[0][1];
    changeHandler({ target: mockCheckbox });

    // Verify layer visibility changes
    expect(mockS2Layers[0].setVisible).toHaveBeenCalledWith(true);
    expect(mockS2Layers[1].setVisible).toHaveBeenCalledWith(false);
  });

  it('handles layer unchecking', () => {
    // Create a mock checkbox with a change handler
    const mockCheckbox = {
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') {
          // Store the handler for later use
          mockCheckbox.changeHandler = handler;
        }
      }),
      value: '2024',
      checked: false
    };

    mockContainer.querySelectorAll = vi.fn().mockReturnValue([mockCheckbox]);
    createCustomLayerSwitcher(mockS2Layers, mockMap);

    // Simulate checkbox change event using the stored handler
    mockCheckbox.changeHandler({ target: mockCheckbox });

    // Verify layer visibility changes
    expect(mockS2Layers[0].setVisible).toHaveBeenCalledWith(false);
    expect(mockS2Layers[1].setVisible).toHaveBeenCalledWith(false);
  });
}); 