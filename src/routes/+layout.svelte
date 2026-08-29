<script lang="ts">
	let { children } = $props();
	import '../app.css';
	import Plausible from '$lib/components/Analytics/Plausible.svelte';
	import Umami from '$lib/components/Analytics/Umami.svelte';
	import Headers from '$lib/components/Headers.svelte';
	import { processVolatile } from './layout';
	import { syncLocalStorage } from '$lib/state/appState.svelte';
	
	//Update Storage as soon as appState.Cards/Timeline are updated
	$effect(() => {
		//$inspect(appState)
		console.debug("processVolatile from +layout.svelte")
		processVolatile()

		syncLocalStorage();
	});

</script>

<svelte:head></svelte:head>

<Headers />

{@render children()}

<Umami />
<Plausible />
