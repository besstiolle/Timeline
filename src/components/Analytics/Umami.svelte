<script lang="ts">
	import ScriptLoader from './ScriptLoader.svelte';
	import { PUBLIC_ANALYTICS_UMAMI_CODE } from '$env/static/public';
	import { PUBLIC_ANALYTICS_UMAMI_SCRIPT } from '$env/static/public';
</script>

{#if PUBLIC_ANALYTICS_UMAMI_CODE !== '' && PUBLIC_ANALYTICS_UMAMI_SCRIPT !== ''}
  <ScriptLoader src={PUBLIC_ANALYTICS_UMAMI_SCRIPT} attributes={{"data-website-id":PUBLIC_ANALYTICS_UMAMI_CODE}} />
{/if}