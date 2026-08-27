<script lang="ts">
	import { m } from '../../../paraglide/messages';
	import { GRID } from '$lib/constantes';
	import { store } from '$lib/stores';
	import { Helpers } from '$lib/helpers';

	// Calcul automatique de la position X basé sur le Store
	let todayXPosition = $derived.by(() => {
		let today = new Date();
		const start = $store.currentTimeline.getStart();
		const end = $store.currentTimeline.getEnd();

		// - GRID.MIDDLE_X because Today's <svg /> start of GRID.MIDDLE_X px on the left
		return Helpers.getViewportXFromDate(today, start, end) - GRID.MIDDLE_X;
		
	});

	// Vérification automatique de l'affichage
	let isVisible = $derived.by(() => {
		if (!$store.currentTimeline.showToday) return false;

		const today = new Date().getTime();
		const start = $store.currentTimeline.getStartTime();
		const end = $store.currentTimeline.getEndTime();

		return today >= start && today <= end;
	});

	const todayColor='#D41E24'

</script>

{#if isVisible}
	<svg
		viewBox={$store.currentTimeline.viewbox}
		xmlns="http://www.w3.org/2000/svg"
		x={GRID.MIDDLE_X}
		y={GRID.MILESTONE_H}
	>
		<rect x="0" y="20" width={todayXPosition} height="5" fill={todayColor} />
		<polygon points="{todayXPosition},25 {todayXPosition + 5},40 {todayXPosition - 5},40" fill={todayColor} />
		<text x={todayXPosition + 7} y="37" font-size="7" class="secondaryFill">{m.today_text()}</text>
		<line
			stroke-dasharray="0.5 2"
			x1={todayXPosition}
			y1="40"
			x2={todayXPosition}
			y2="100%"
			stroke={todayColor}
		/>
	</svg>
{/if}
