<script>
	let { children } = $props();
    import "../app.css";
	import Plausible from "../components/Analytics/Plausible.svelte";
	import Umami from "../components/Analytics/Umami.svelte";
	import Headers from "../components/Headers.svelte";

</script>


<svelte:head>
	
</svelte:head>

<Headers />

{@render children()}

<Umami /> <Plausible />