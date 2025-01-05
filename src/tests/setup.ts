import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { readable } from 'svelte/store';

// Mock SvelteKit's navigation and page stores
vi.mock('$app/navigation', () => ({
  goto: vi.fn(),
  invalidate: vi.fn()
}));

vi.mock('$app/stores', () => ({
  page: readable({
    url: new URL('http://localhost'),
    params: {},
    route: { id: null }
  }),
  navigating: readable(null),
  updated: readable(false)
}));