import { vi } from 'vitest';

// Mock document methods
vi.stubGlobal('document', {
  createElement: vi.fn().mockImplementation((tagName) => ({
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
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
  })),
  createTextNode: vi.fn(),
  querySelector: vi.fn(),
  querySelectorAll: vi.fn().mockReturnValue([]),
  getElementById: vi.fn().mockReturnValue({ 
    querySelector: vi.fn(),
    querySelectorAll: vi.fn().mockReturnValue([])
  }),
  body: {
    appendChild: vi.fn(),
    removeChild: vi.fn()
  }
});

// Mock window methods
vi.stubGlobal('window', {
  innerWidth: 1024,
  innerHeight: 768,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
});

// Mock ResizeObserver
vi.stubGlobal('ResizeObserver', vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
})));

// Mock IntersectionObserver
vi.stubGlobal('IntersectionObserver', vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))); 

vi.mock('ol/layer/WebGLTile', async (importOriginal) => {
  const layer = await importOriginal();
  return {
    ...layer,
    setMap: vi.fn()
  };
});

vi.mock('ol/source/XYZ', async (importOriginal) => {
  const source = await importOriginal();
  return {
    ...source,
    getUrl: vi.fn()
  };
});

vi.mock('ol/layer/Group', async (importOriginal) => {
  const group = await importOriginal();
  return {
    ...group,
    setMap: vi.fn()
  };
});

vi.mock('ol/control/defaults', async (importOriginal) => {
  const defaults = await importOriginal();
  return vi.fn().mockImplementation(() => defaults);
});

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