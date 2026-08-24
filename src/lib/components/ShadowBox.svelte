<script lang="ts">
	import type { Snippet } from 'svelte';
	import { m } from '../../paraglide/messages';
	import { shadowBoxComponentState } from '$lib/state/shadowBoxComponentState.svelte';

	interface Props {
        children: Snippet;
		id: string;
    }

	let {
		//children is a native SvelteKit property, get the content from parent to slot (@render)
        children,
		id,
    }: Props = $props();

	// Authomatic synchronisation between the lock value and the classe on <body />
	$effect(() => {
		document.body.classList.toggle('lock', isShadowBoxOpened());

		// Cleanup in case if component is destroyed during opening
		return () => {
			document.body.classList.remove('lock');
		};
	});
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closingShadowBox()
		}
	}


	function isShadowBoxOpened(){
		return shadowBoxComponentState.openShadowBoxForLiveEdition
				|| shadowBoxComponentState.openShadowBoxForOnline
				|| shadowBoxComponentState.openShadowBoxForUpload
				|| shadowBoxComponentState.openShadowBoxForVersion
		
	}
	function closingShadowBox(){
		shadowBoxComponentState.openShadowBoxForLiveEdition = false;
		shadowBoxComponentState.openShadowBoxForOnline = false;
		shadowBoxComponentState.openShadowBoxForUpload = false;
		shadowBoxComponentState.openShadowBoxForVersion = false;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="ShadowBoxBG"
	class:hidden={!isShadowBoxOpened()}
	onclick={closingShadowBox}
	onkeydown={closingShadowBox}
	role="button"
	tabindex="0"
></div>
<div {id} class="ShadowBox bg-sky-50 dark:bg-gray-700 p-4" class:hidden={!isShadowBoxOpened()}>
	<div class="ShadowContent">
		{@render children?.()}
	</div>
	<div class="ShadowClosing">
		{m.shadowbox_exit_instruction_0()}
		<span
			class="pointer font-bold"
			onclick={closingShadowBox}
			onkeydown={closingShadowBox}
			role="button"
			tabindex="0"
		>
			{m.shadowbox_exit_instruction_1()}
		</span>
		{m.shadowbox_exit_instruction_2()}
		<span class="font-bold">
			{m.shadowbox_exit_instruction_3()}
		</span>
		{m.shadowbox_exit_instruction_4()}
	</div>
</div>

<style>
	.ShadowBoxBG {
		height: 100vh;
		width: 100vw;
		position: fixed;
		top: 0;
		left: 0;
		backdrop-filter: blur(0.3rem);
		z-index: 1;
	}
	.ShadowBox {
		width: 40vw;
		max-height: 80vh;
		position: absolute;
		text-align: center;
		top: 10vh;
		left: 30vw;
		outline: 2px dashed #92b0b3 !important;
		outline-offset: -10px !important;
		position: fixed;
		z-index: 2;
	}
	.ShadowContent,
	.ShadowClosing {
		padding: 1vh;
		overflow: scroll;
		max-height: 80vh;
	}
	:global(.lock) {
		overflow-y: hidden;
	}
</style>
