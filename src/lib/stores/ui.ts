import { writable } from 'svelte/store';

interface UIState {
  isLoading: boolean;
  error: string | null;
}

function createUIStore() {
  const { subscribe, set, update } = writable<UIState>({
    isLoading: false,
    error: null
  });

  return {
    subscribe,
    startLoading: () => update(state => ({ ...state, isLoading: true })),
    stopLoading: () => update(state => ({ ...state, isLoading: false })),
    setError: (error: string) => update(state => ({ ...state, error })),
    clearError: () => update(state => ({ ...state, error: null })),
    reset: () => set({ isLoading: false, error: null })
  };
}

export const ui = createUIStore();