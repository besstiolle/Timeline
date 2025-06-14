<script lang="ts">
	import { m } from '../../../paraglide/messages';
	import { GRID } from '$lib/constantes';
	import { store } from '$lib/stores';
	import { displayableTodayMarker } from '$lib/derivedStore';
</script>

{#if $displayableTodayMarker.toDisplay}
	{@const widthToday = $displayableTodayMarker.widthToday}
	{@const todayColor = $displayableTodayMarker.todayColor}

	<svg
		viewBox={$store.currentTimeline.viewbox}
		xmlns="http://www.w3.org/2000/svg"
		x={GRID.MIDDLE_X}
		y={GRID.MILESTONE_H}
	>
		<rect x="0" y="20" width={widthToday} height="5" fill={todayColor} />
		<polygon points="{widthToday},25 {widthToday + 5},40 {widthToday - 5},40" fill={todayColor} />
		<text x={widthToday + 7} y="37" font-size="7" class="secondaryFill">{m.today_text()}</text>
		<line
			stroke-dasharray="0.5 2"
			x1={widthToday}
			y1="40"
			x2={widthToday}
			y2="100%"
			stroke={todayColor}
		/>
	</svg>
{/if}
