<script lang="ts">
	import '../app.css';
	import ErrorBoundary from '$lib/components/ErrorBoundary.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<ErrorBoundary>
	<LoadingSpinner />
	<slot />
</ErrorBoundary>
