<script>
	let { children } = $props();
    import "../app.css";
	import Headers from "../components/Headers.svelte";

</script>

<Headers />

{@render children()}