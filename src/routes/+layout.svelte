<script>
	let { children } = $props();
	import '../app.css';
	import Plausible from '$lib/components/Analytics/Plausible.svelte';
	import Umami from '$lib/components/Analytics/Umami.svelte';
	import Headers from '$lib/components/Headers.svelte';
</script>

<svelte:head></svelte:head>

<Headers />

{@render children()}

<Umami />
<Plausible />
