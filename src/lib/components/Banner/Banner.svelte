<script lang="ts">
	import { GRID } from '$lib/constantes';
	import { displayableStepInCalendar } from '$lib/derivedStore';
	import { store } from '$lib/stores';


</script>

<svg xmlns="http://www.w3.org/2000/svg">
	<defs>
		<linearGradient id="Gradient1" x1="0" x2="0" y1="0" y2="1">
			<stop offset="0%" stop-color="#475569" />
			<stop offset="100%" stop-color="#4F5764" />
		</linearGradient>

		<linearGradient id="Gradient2" x1="0" x2="0" y1="0" y2="1">
			<stop offset="0%" stop-color="#475569" stop-opacity="0.3" />
			<stop offset="100%" stop-opacity="0" />
		</linearGradient>
	</defs>
</svg>

<svg
	data-testid="Banner.svelte"
	viewBox={$store.currentTimeline.viewbox}
	xmlns="http://www.w3.org/2000/svg"
	x={GRID.LEFT_WIDTH}
	y={GRID.MILESTONE_H}
>
	<rect x="-10" y="0" width={GRID.MIDDLE_WIDTH + 50} height="25" fill="url(#Gradient1)" />
	<rect x="-10" y="30" width={GRID.MIDDLE_WIDTH + 50} height="25" fill="url(#Gradient2)" />
	{#each $displayableStepInCalendar as { left, label, classCss }, index (index)}
		<path d="M{left} 6 v 14" fill="transparent" stroke="#818C9C" />
		<text
			data-testid="jalonText_{index}"
			x={left + 5}
			y="17"
			font-size="12"
			fill="#818C9C"
			class={classCss}>{label}</text
		>
	{/each}
</svg>

<style>
	:global(.newYear) {
		fill: rgb(222, 184, 135);
	}
</style>
