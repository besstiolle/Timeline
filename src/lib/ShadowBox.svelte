<script lang="ts">
	import { m } from '../paraglide/messages';

	let hidden = $state(true);
	//children is a native SvelteKit property, get the content from parent to slot (@render)
	const props = $props();
	const children = props.children;
	const id = props.id as string;
	export function closeComponent() {
		hidden = true;
		document.body.classList.remove('lock');
	}
	export function openComponent() {
		hidden = false;
		document.body.classList.add('lock');
	}
	function handleKeydown(event: KeyboardEvent) {
		if (!hidden && event.key === 'Escape') {
			closeComponent();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div
	class="ShadowBoxBG"
	class:hidden
	onclick={closeComponent}
	onkeydown={closeComponent}
	role="button"
	tabindex="0"
></div>
<div {id} class="ShadowBox bg-sky-50 dark:bg-gray-700 p-4" class:hidden>
	<div class="ShadowContent">
		{@render children?.()}
	</div>
	<div class="ShadowClosing">
		{m.shadowbox_exit_instruction_0()}
		<span
			class="pointer font-bold"
			onclick={closeComponent}
			onkeydown={closeComponent}
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
