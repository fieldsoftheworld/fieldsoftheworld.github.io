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
  querySelector: vi.fn(),
  querySelectorAll: vi.fn().mockReturnValue([]),
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