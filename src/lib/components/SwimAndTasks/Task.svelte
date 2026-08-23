<script lang="ts">
	import { GRID } from '$lib/constantes';
	import { store } from '$lib/stores';
	import type { TaskViewModel } from '$lib/viewModel';

	interface Props {
        i: number;
        taskVM: TaskViewModel;
        showActionBar: (event: Event) => void;
        hideActionBar: (event: Event) => void;
        downLeft: (event: MouseEvent, taskId:number) => void;
        downRight: (event: MouseEvent, taskId:number) => void;
        downProgress: (event: MouseEvent, taskId:number) => void;
    }

	let {
        i,
        taskVM,
        showActionBar,
        hideActionBar,
        downLeft,
        downRight,
        downProgress
    }: Props = $props();


	const grey = '#95A5A6';
	const greyStroke = '#9B9B9B';
	const white = '#FFFFFF';
	
</script>

<svg
	viewBox={$store.currentTimeline.viewbox}
	xmlns="http://www.w3.org/2000/svg"
	x="0"
	y={i * GRID.ONE_TASK_H + GRID.MILESTONE_H + GRID.ANNUAL_H}
	class="taskSVGSection"
	id="T{taskVM.id}"
	onmouseover={showActionBar}
	onfocus={showActionBar}
	onmouseout={hideActionBar}
	onblur={hideActionBar}
	class:shouldBeHidden={!taskVM.isShow}
	role="none"
>
	{#if taskVM.hasSwimline}
		<text text-anchor="end" x={taskVM.leftGrayXPosition - 5} y="10.5" font-size="9" class="primaryFill"
			>{taskVM.label}</text
		>
	{:else}
		<text text-anchor="end" x={GRID.MIDDLE_X - 5} y="10.5" font-size="9" class="primaryFill"
			>{taskVM.label}</text
		>
		<line
			stroke-dasharray="0.5 2"
			x1={GRID.MIDDLE_X}
			y1="8"
			x2={taskVM.leftGrayXPosition - 5}
			y2="8"
			class="secondaryStroke"
		/>
	{/if}

	{#if taskVM.hasProgress}
		{#if taskVM.progress < 100}
			<rect
				x={taskVM.leftGrayXPosition}
				y="0"
				width={taskVM.grayWidth}
				height="15"
				rx="5"
				ry="5"
				fill={grey}
				stroke={greyStroke}
				stroke-width="0.05em"
			/>
		{/if}

		<rect
			id="T{taskVM.id}_progressBar"
			x={taskVM.leftGrayXPosition}
			y="0"
			width={taskVM.progressWidth}
			height="15"
			rx="5"
			ry="5"
			fill={taskVM.fillColor}
			stroke={taskVM.strokeColor}
			stroke-width="0.05em"
		/>
		<text
			id="T{taskVM.id}_plabel"
			text-anchor={taskVM.percentTextAnchor}
			x={taskVM.percentXPosition}
			y="10.5"
			fill={white}>{taskVM.progress}%</text
		>
	{:else}
		<rect
			id="T{taskVM.id}_progressBar"
			x={taskVM.leftGrayXPosition}
			y="0"
			width={taskVM.grayWidth}
			height="15"
			rx="5"
			ry="5"
			fill={taskVM.fillColor}
			stroke={taskVM.strokeColor}
			stroke-width="0.05em"
		/>
	{/if}

	<text id="T{taskVM.id}_rlabel" x={taskVM.rightGrayXPosition + 5} y="10.5" class="secondaryFill"
		>{taskVM.labelRight}</text
	>
	<!-- Draggable overlay -->
	<rect
		id="T{taskVM.id}_rec"
		x={taskVM.leftGrayXPosition}
		y="0"
		width={taskVM.grayWidth}
		class="showable hidden"
		height="15"
		rx="5"
		ry="5"
		fill="url(#pattern_A)"
	/>

	<svg
		id="T{taskVM.id}_l"
		x={taskVM.leftGrayXPosition - 5}
		y="10"
		width="15px"
		height="15px"
		viewBox="0 0 20 20"
		class:grabbable={!$store.rights.isReader()}
		class="showable hidden"
	>
		<use href="#filler" onmousedown={(e) => downLeft(e, taskVM.id)} role="presentation" />
		<use href="#drag_left" class="secondaryFill" onmousedown={(e) => downLeft(e, taskVM.id)} role="presentation" />
	</svg>
	<svg
		id="T{taskVM.id}_r"
		x={taskVM.rightGrayXPosition - 10}
		y="10"
		width="15px"
		height="15px"
		viewBox="0 0 20 20"
		class:grabbable={!$store.rights.isReader()}
		class="showable hidden"
	>
		<use href="#filler" onmousedown={(e) => downRight(e, taskVM.id)} role="presentation" />
		<use href="#drag_right" class="secondaryFill" onmousedown={(e) => downRight(e, taskVM.id)} role="presentation" />
	</svg>
	{#if taskVM.hasProgress}
		<svg
			id="T{taskVM.id}_p"
			x={taskVM.percentXPosition}
			y="10"
			width="15px"
			height="15px"
			viewBox="0 0 20 20"
			class:grabbable={!$store.rights.isReader()}
			class="showable hidden debug_{taskVM.leftGrayXPosition}_{taskVM.rightGrayXPosition}"
		>
			<use href="#filler" onmousedown={(e) => downProgress(e, taskVM.id)} role="presentation" />
			<use
				href="#drag_progress"
				class="secondaryFill"
				onmousedown={(e) => downProgress(e, taskVM.id)}
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
