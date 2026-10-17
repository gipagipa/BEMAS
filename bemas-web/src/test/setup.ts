import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});

// Mock window.scrollTo in jsdom
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});
