<script lang="ts">
	import { page } from '$app/state';
	import ScriptLoader from './ScriptLoader.svelte';

	const code = page.data.ANALYTICS_UMAMI_CODE !== undefined ? page.data.ANALYTICS_UMAMI_CODE : '';
	const script =
		page.data.ANALYTICS_UMAMI_SCRIPT !== undefined ? page.data.ANALYTICS_UMAMI_SCRIPT : '';
</script>

{#if script !== '' && code !== ''}
	<ScriptLoader src={script} attributes={{ 'data-website-id': code }} />
{/if}
