<script lang="ts">
	import { page } from '$app/state';
	import ScriptLoader from './ScriptLoader.svelte';

	const code =
		page.data.ANALYTICS_PLAUSIBLE_CODE !== undefined ? page.data.ANALYTICS_PLAUSIBLE_CODE : '';
	const script =
		page.data.ANALYTICS_PLAUSIBLE_SCRIPT !== undefined ? page.data.ANALYTICS_PLAUSIBLE_SCRIPT : '';
</script>

{#if script !== '' && code !== ''}
	<ScriptLoader src={script} attributes={{ 'data-domain': code }} />
{/if}
