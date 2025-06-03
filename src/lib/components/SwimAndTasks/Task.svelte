<script lang="ts">
	import { GRID, MONTHS } from '$lib/constantes';

	import { Helpers } from '$lib/helpers';
	import { store } from '$lib/stores';
	import type { Task } from '$lib/struct.class';

	const props = $props();
	const i = props.i as number;
	const currentTask = props.currentTask as Task;
	const showActionBar = props.showActionBar as (event: Event) => object;
	const hideActionBar = props.hideActionBar as (event: Event) => object;
	const downLeft = props.downLeft as (event: Event) => object;
	const downRight = props.downRight as (event: Event) => object;
	const downProgress = props.downProgress as (event: Event) => object;

	const green = '#16A085';
	const greenStroke = '#117A65';
	const blue = '#2980B9';
	const blueStroke = '#236B99';
	const grey = '#95A5A6';
	const greyStroke = '#9B9B9B';
	const white = '#FFFFFF';
	//const rightLabel = "#44546A";
	//const leftLabel = "#000000";
	//const dottedLine = "#44546A";

	let styleColor = $state({ fill: green, stroke: greenStroke }); //default : full
	if (currentTask.hasProgress && currentTask.progress < 100) {
		styleColor = { fill: blue, stroke: blueStroke };
	}

	let labelRight: string =
		currentTask.getStart().getDate() +
		' ' +
		MONTHS[currentTask.getStart().getMonth()] +
		' - ' +
		currentTask.getEnd().getDate() +
		' ' +
		MONTHS[currentTask.getEnd().getMonth()];

	let xGrayPosition = Helpers.getViewportXFromDate(
		currentTask.getStart(),
		$store.currentTimeline.getStart(),
		$store.currentTimeline.getEnd()
	);

	//A quick fix to alterate visualy the end date
	// It will 'fill' the day event if date start = date end
	let fakeEndDate = currentTask.getEnd();
	fakeEndDate.setDate(fakeEndDate.getDate() + 1);

	let x2GrayPosition = Helpers.getViewportXFromDate(
		fakeEndDate,
		$store.currentTimeline.getStart(),
		$store.currentTimeline.getEnd()
	);

	let widthGray = x2GrayPosition - xGrayPosition;
	let widthProgress = (currentTask.progress * widthGray) / 100;

	let xPercentPosition = $state(xGrayPosition + widthProgress - 5);
	let percentTextAnchor = $state('end');
	if (currentTask.progress < 50) {
		xPercentPosition = xGrayPosition + widthProgress + 5;
		percentTextAnchor = 'start';
	}

	let hasSwimline = currentTask.swimline && currentTask.swimline !== '';
</script>

<svg
	viewBox={$store.currentTimeline.viewbox}
	xmlns="http://www.w3.org/2000/svg"
	x="0"
	y={i * GRID.ONE_TASK_H + GRID.MILESTONE_H + GRID.ANNUAL_H}
	class="taskSVGSection"
	id="T{currentTask.id}"
	onmouseover={showActionBar}
	onfocus={showActionBar}
	onmouseout={hideActionBar}
	onblur={hideActionBar}
	class:shouldBeHidden={!currentTask.isShow}
	role="none"
>
	{#if hasSwimline}
		<text text-anchor="end" x={xGrayPosition - 5} y="10.5" font-size="9" class="primaryFill"
			>{currentTask.label}</text
		>
	{:else}
		<text text-anchor="end" x={GRID.MIDDLE_X - 5} y="10.5" font-size="9" class="primaryFill"
			>{currentTask.label}</text
		>
		<line
			stroke-dasharray="0.5 2"
			x1={GRID.MIDDLE_X}
			y1="8"
			x2={xGrayPosition - 5}
			y2="8"
			class="secondaryStroke"
		/>
	{/if}

	{#if currentTask.hasProgress}
		{#if currentTask.progress < 100}
			<rect
				x={xGrayPosition}
				y="0"
				width={widthGray}
				height="15"
				rx="5"
				ry="5"
				fill={grey}
				stroke={greyStroke}
				stroke-width="0.05em"
			/>
		{/if}

		<rect
			id="T{currentTask.id}_progressBar"
			x={xGrayPosition}
			y="0"
			width={widthProgress}
			height="15"
			rx="5"
			ry="5"
			fill={styleColor.fill}
			stroke={styleColor.stroke}
			stroke-width="0.05em"
		/>
		<text
			id="T{currentTask.id}_plabel"
			text-anchor={percentTextAnchor}
			x={xPercentPosition}
			y="10.5"
			fill={white}>{currentTask.progress}%</text
		>
	{:else}
		<rect
			id="T{currentTask.id}_progressBar"
			x={xGrayPosition}
			y="0"
			width={widthGray}
			height="15"
			rx="5"
			ry="5"
			fill={styleColor.fill}
			stroke={styleColor.stroke}
			stroke-width="0.05em"
		/>
	{/if}

	<text id="T{currentTask.id}_rlabel" x={x2GrayPosition + 5} y="10.5" class="secondaryFill"
		>{labelRight}</text
	>
	<!-- Draggable overlay -->
	<rect
		id="T{currentTask.id}_rec"
		x={xGrayPosition}
		y="0"
		width={widthGray}
		class="showable hidden"
		height="15"
		rx="5"
		ry="5"
		fill="url(#pattern_A)"
	/>

	<svg
		id="T{currentTask.id}_l"
		x={xGrayPosition - 5}
		y="10"
		width="15px"
		height="15px"
		viewBox="0 0 20 20"
		class:grabbable={!$store.rights.isReader()}
		class="showable hidden"
	>
		<use href="#filler" onmousedown={downLeft} role="presentation" />
		<use href="#drag_left" class="secondaryFill" onmousedown={downLeft} role="presentation" />
	</svg>
	<svg
		id="T{currentTask.id}_r"
		x={x2GrayPosition - 10}
		y="10"
		width="15px"
		height="15px"
		viewBox="0 0 20 20"
		class:grabbable={!$store.rights.isReader()}
		class="showable hidden"
	>
		<use href="#filler" onmousedown={downRight} role="presentation" />
		<use href="#drag_right" class="secondaryFill" onmousedown={downRight} role="presentation" />
	</svg>
	{#if currentTask.hasProgress}
		<svg
			id="T{currentTask.id}_p"
			x={xGrayPosition + (x2GrayPosition - xGrayPosition) / 2 - 10}
			y="10"
			width="15px"
			height="15px"
			viewBox="0 0 20 20"
			class:grabbable={!$store.rights.isReader()}
			class="showable hidden"
		>
			<use href="#filler" onmousedown={downProgress} role="presentation" />
			<use
				href="#drag_progress"
				class="secondaryFill"
				onmousedown={downProgress}
				role="presentation"
			/>
		</svg>
	{/if}
	<!-- END overlay-->
</svg>

<style>
	.grabbable {
		cursor: grab;
		display: block;
	}
	:global(.grabbable.grabbing) {
		cursor: grabbing;
	}
</style>
