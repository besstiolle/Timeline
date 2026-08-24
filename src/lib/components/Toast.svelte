<script lang="ts">
	let timeout: ReturnType<typeof setTimeout>;
	let content: string = $state('N/A');

	let isVisible = $state(false);
    let isPersisted = $state(false);
    let isSuccess = $state(true);

	export function show(newContent: string, success: boolean = true, timer: number = 3) {
		clearTimeout(timeout);
		content = newContent;
		isSuccess = success
		isVisible=true
		isPersisted = timer <= 0

		if (timer > 0) {
			timeout = setTimeout(hide, timer * 1000);
		} else {
		}
	}

	function hide() {
		clearTimeout(timeout);
		content = 'N/A';
		isVisible = false;
        isPersisted = false;
	}
</script>

<div 
	class:show={isVisible && !isPersisted} 
    class:showAndPersist={isVisible && isPersisted}
    class:error={!isSuccess}
	onclick={hide}
	onkeydown={hide} 
	role="button" 
	tabindex="0"
>
	{content}
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
