<script lang="ts">
	import { GRID } from '$lib/constantes';
	import { store } from '$lib/stores';

	let startString = $store.currentTimeline.start;
	let endString = $store.currentTimeline.end;
</script>

<div id="grid">
	<svg
		width="100%"
		viewBox="0 0 {GRID.ALL_WIDTH} {GRID.ALL_WIDTH / 2}"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect x="0" y="0" width={GRID.ALL_WIDTH} height={GRID.ALL_WIDTH / 2} fill="black" />

		<rect x="0" y="0" width={GRID.RIGHT_X} height={GRID.ALL_WIDTH / 2} fill="green" />
		<text text-anchor="end" x={GRID.RIGHT_X} y="30" font-size="10" fill="white">{GRID.RIGHT_X}</text
		>
		<text text-anchor="end" x={GRID.RIGHT_X} y="50" font-size="10" fill="white">{endString}</text>

		<rect x="0" y="0" width={GRID.MIDDLE_X} height={GRID.ALL_WIDTH / 2} fill="red" />
		<text text-anchor="end" x={GRID.MIDDLE_X} y="30" font-size="10" fill="white"
			>{GRID.MIDDLE_X}</text
		>
		<text text-anchor="start" x={GRID.MIDDLE_X} y="50" font-size="10" fill="white"
			>{startString}</text
		>

		<text text-anchor="end" x={GRID.ALL_WIDTH} y="30" font-size="10" fill="white"
			>{GRID.ALL_WIDTH}</text
		>

		<!--svg x="100" y="0" width="300" height="300" viewBox="0 0 2000 2000" xmlns="http://www.w3.org/2000/svg">
        <rect x="0" y="0" width="2000" height="2000" fill="#00FF00"/>
        <rect x="0" y="0" width="1500" height="1000" fill="#FF00FF"/>
    </svg-->
	</svg>
</div>

<style>
	#grid {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0.2;
	}
</style>
