<script lang="ts">
	import { toastComponentState } from "$lib/state/toastComponent.svelte";
</script>

<div 
	class:show={toastComponentState.isVisible && !toastComponentState.isPersisted} 
    class:showAndPersist={toastComponentState.isVisible && toastComponentState.isPersisted}
    class:error={!toastComponentState.isSuccess}
	onclick={() => toastComponentState.hide()}
	onkeydown={() => toastComponentState.hide()} 
	role="button" 
	tabindex="0"
>
	{toastComponentState.message}
</div>

<style>
	div {
		visibility: hidden;
		min-width: 20vw;
		max-width: 20vw;
		background-color: rgb(22, 160, 133);
		border: 1px solid rgb(17, 122, 101);
		color: #333;
		font-weight: bold;
		text-align: center;
		border-radius: 10px;
		padding: 16px;
		position: fixed;
		z-index: 1;
		left: 40vw;
		bottom: 2vh;
		cursor: pointer;
		word-wrap: break-word;
	}

	:global(div.show) {
		visibility: visible;
		-webkit-animation:
			fadein 0.5s,
			fadeout 0.5s 2.5s;
		animation:
			fadein 0.5s,
			fadeout 0.5s 2.5s;
	}

	:global(div.showAndPersist) {
		visibility: visible;
		-webkit-animation: fadein 0.5s;
		animation: fadein 0.5s;
	}

	:global(div.error) {
		background-color: rgb(204, 51, 0);
		border: 1px solid rgb(255, 153, 102);
		color: #ccc;
	}
</style>
