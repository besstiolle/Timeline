<script lang="ts">
	import { DAYS, DIFF, GRID, MONTHS } from '$lib/constantes';
	import { store } from '$lib/stores';

	interface jalonInterface {
		left: number;
		label: string;
		classCss: string;
	}

	let dateInc = $store.currentTimeline.getStart() as Date;

	let i = 0;
	let jalons: jalonInterface[] = [];
	let innerClassCss: string;
	let innerLabel: number | string = '';
	let left: number;
	while (i < 100 && $store.currentTimeline.getEndTime() >= dateInc.getTime()) {
		i++;
		left =
			((dateInc.getTime() - $store.currentTimeline.getStartTime()) /
				($store.currentTimeline.getEndTime() - $store.currentTimeline.getStartTime())) *
			GRID.MIDDLE_WIDTH;
		innerClassCss = '';

		if ($store.currentTimeline.differencial === DIFF.isMoreThan20Years) {
			innerLabel = dateInc.getUTCFullYear();
			dateInc = new Date(dateInc.setFullYear(dateInc.getFullYear() + 2));
		}
		if ($store.currentTimeline.differencial === DIFF.isBetween10YearsAnd20Years) {
			innerLabel = dateInc.getUTCFullYear();
			dateInc = new Date(dateInc.setFullYear(dateInc.getFullYear() + 1));
		}
		if ($store.currentTimeline.differencial === DIFF.isBetween6YearsAnd10Years) {
			innerLabel = dateInc.getMonth() == 0 ? dateInc.getUTCFullYear() : MONTHS[dateInc.getMonth()];
			dateInc = new Date(dateInc.setMonth(dateInc.getMonth() + 6));
		}
		if ($store.currentTimeline.differencial === DIFF.isBetween3YearsAnd6Years) {
			innerLabel = dateInc.getMonth() == 0 ? dateInc.getUTCFullYear() : MONTHS[dateInc.getMonth()];
			innerClassCss = dateInc.getMonth() == 0 ? 'newYear' : '';
			dateInc = new Date(dateInc.setMonth(dateInc.getMonth() + 3));
		}
		if ($store.currentTimeline.differencial === DIFF.isBetween20MonthsAnd3Years) {
			innerLabel = dateInc.getMonth() == 0 ? dateInc.getUTCFullYear() : MONTHS[dateInc.getMonth()];
			innerClassCss = dateInc.getMonth() == 0 ? 'newYear' : '';
			dateInc = new Date(dateInc.setMonth(dateInc.getMonth() + 2));
		}
		if ($store.currentTimeline.differencial === DIFF.isBetween5MonthsAnd20Months) {
			innerLabel = dateInc.getMonth() == 0 ? dateInc.getUTCFullYear() : MONTHS[dateInc.getMonth()];
			innerClassCss = dateInc.getMonth() == 0 ? 'newYear' : '';
			dateInc = new Date(dateInc.setMonth(dateInc.getMonth() + 1));
		}
		if ($store.currentTimeline.differencial === DIFF.isBetween1MonthAnd5Months) {
			innerLabel = dateInc.getDate() + '/' + (dateInc.getMonth() + 1);
			innerClassCss = dateInc.getDate() < 8 ? 'newYear' : '';
			dateInc = new Date(dateInc.setDate(dateInc.getDate() + 7));
		}
		if ($store.currentTimeline.differencial === DIFF.isBelow1Month) {
			innerLabel = dateInc.getDay() == 0 ? DAYS[0] : dateInc.getDate();
			innerClassCss = dateInc.getDay() == 0 ? 'newYear' : '';
			dateInc = new Date(dateInc.setDate(dateInc.getDate() + 1));
		}

		jalons.push({
			left: left,
			label: innerLabel as string,
			classCss: innerClassCss
		});
	}
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
	{#each jalons as { left, label, classCss }, index (index)}
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
