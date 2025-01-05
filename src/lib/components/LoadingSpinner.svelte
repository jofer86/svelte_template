<script lang="ts">
  import { onMount } from 'svelte';
  import { ui } from '$lib/stores/ui';

  let isLoading = false;

  onMount(() => {
    const unsubscribe = ui.subscribe(state => {
      isLoading = state.isLoading;
    });

    return unsubscribe;
  });
</script>

{#if isLoading}
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50">
    <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
  </div>
{/if}