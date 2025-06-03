<script lang="ts">
	let timeout: NodeJS.Timeout | string | number | undefined;
	let toast: HTMLElement;
	let content: string = '';

	export function show(newContent: string, success: boolean = true, timer: number = 3) {
		clearTimeout(timeout);

		if (success) {
			toast.classList.add('success');
		} else {
			toast.classList.add('error');
		}
		content = newContent;
		if (timer > 0) {
			toast.classList.add('show');
			timeout = setTimeout(function () {
				hide();
			}, timer * 1000);
		} else {
			toast.classList.add('showAndPersist');
		}
	}

	function hide() {
		clearTimeout(timeout);
		toast.classList.remove('show');
		toast.classList.remove('showAndPersist');
		toast.classList.remove('success');
		toast.classList.remove('error');
		content = 'N/A';
	}
</script>

<div bind:this={toast} onclick={hide} onkeydown={hide} role="button" tabindex="0">{content}</div>

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
