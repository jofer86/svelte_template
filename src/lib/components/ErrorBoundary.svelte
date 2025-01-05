<script lang="ts">
  import { onMount } from 'svelte';
  import { ui } from '$lib/stores/ui';

  let error: string | null = null;

  onMount(() => {
    const unsubscribe = ui.subscribe(state => {
      error = state.error;
    });

    return unsubscribe;
  });
</script>

{#if error}
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
      <h2 class="text-xl font-semibold text-red-600 mb-4">Error</h2>
      <p class="text-gray-700 mb-4">{error}</p>
      <button
        class="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        on:click={() => ui.clearError()}
      >
        Dismiss
      </button>
    </div>
  </div>
{/if}

<slot />