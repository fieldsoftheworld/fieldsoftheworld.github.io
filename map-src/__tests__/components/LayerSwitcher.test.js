import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCustomLayerSwitcher } from '../../components/LayerSwitcher';
import Map from 'ol/Map';

describe('LayerSwitcher', () => {
  const mockMap = new Map();
  let mockS2Layers;
  let mockAttribution;
  let mockContainer;

  beforeEach(() => {
    // Reset DOM mocks
    vi.clearAllMocks();

    // Mock DOM elements
    mockContainer = {
      className: '',
      appendChild: vi.fn(),
      querySelectorAll: vi.fn().mockReturnValue([])
    };

    // Mock document methods
    document.createElement = vi.fn().mockImplementation((tagName) => ({
      className: '',
      appendChild: vi.fn(),
      querySelectorAll: vi.fn().mockReturnValue([]),
      innerHTML: ''
    }));

    // Mock S2 layers
    mockS2Layers = [
      { get: vi.fn().mockReturnValue('2024'), setVisible: vi.fn() },
      { get: vi.fn().mockReturnValue('2023'), setVisible: vi.fn() }
    ];

    // Mock attribution element
    mockAttribution = {
      innerHTML: '',
      style: { display: 'none' }
    };
  });

  it('creates layer switcher with correct structure', () => {
    createCustomLayerSwitcher(mockS2Layers, mockAttribution, mockMap);

    expect(mockContainer.appendChild).toHaveBeenCalled();
    const container = mockContainer.appendChild.mock.calls[0][0];
    expect(container.className).toBe('custom-layer-switcher');
  });

  it('creates checkboxes for each layer', () => {
    const mockCheckboxes = [
      { addEventListener: vi.fn(), value: '2024', checked: false },
      { addEventListener: vi.fn(), value: '2023', checked: false }
    ];

    mockContainer.querySelectorAll = vi.fn().mockReturnValue(mockCheckboxes);
    createCustomLayerSwitcher(mockS2Layers, mockAttribution, mockMap);

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
    createCustomLayerSwitcher(mockS2Layers, mockAttribution, mockMap);

    // Simulate checkbox change event
    const changeHandler = mockCheckbox.addEventListener.mock.calls[0][1];
    changeHandler({ target: mockCheckbox });

    // Verify layer visibility changes
    expect(mockS2Layers[0].setVisible).toHaveBeenCalledWith(true);
    expect(mockS2Layers[1].setVisible).toHaveBeenCalledWith(false);
    expect(mockAttribution.style.display).toBe('block');
    expect(mockAttribution.innerHTML).toContain('2024');
  });

  it('handles layer unchecking', () => {
    const mockCheckbox = {
      addEventListener: vi.fn(),
      value: '2024',
      checked: false
    };

    mockContainer.querySelectorAll = vi.fn().mockReturnValue([mockCheckbox]);
    createCustomLayerSwitcher(mockS2Layers, mockAttribution, mockMap);

    // Simulate checkbox change event
    const changeHandler = mockCheckbox.addEventListener.mock.calls[0][1];
    changeHandler({ target: mockCheckbox });

    // Verify layer visibility changes
    expect(mockS2Layers[0].setVisible).toHaveBeenCalledWith(false);
    expect(mockS2Layers[1].setVisible).toHaveBeenCalledWith(false);
    expect(mockAttribution.style.display).toBe('none');
  });
}); 