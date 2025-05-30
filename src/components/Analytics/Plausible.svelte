<script lang="ts">
	import ScriptLoader from './ScriptLoader.svelte';
	import { PUBLIC_ANALYTICS_PLAUSIBLE_CODE } from '$env/static/public';
	import { PUBLIC_ANALYTICS_PLAUSIBLE_SCRIPT } from '$env/static/public';
</script>

{#if PUBLIC_ANALYTICS_PLAUSIBLE_CODE !== '' && PUBLIC_ANALYTICS_PLAUSIBLE_SCRIPT !== ''}
  <ScriptLoader src={PUBLIC_ANALYTICS_PLAUSIBLE_SCRIPT} attributes={{"data-domain":PUBLIC_ANALYTICS_PLAUSIBLE_CODE}} />
{/if}