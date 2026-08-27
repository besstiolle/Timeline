<script lang="ts">
	import { COLORS, GRID } from '$lib/constantes';
	import { store } from '$lib/stores';
	import type { Task } from '$lib/struct.class';
	import { displayableSwimlines as swimlinesToDerive, displayableTasks as tasksToDerive } from './SwimAndTasks';


	const displayableTasks = $derived(
		tasksToDerive($store.currentTimeline)
	)

	const displayableSwimlines = $derived(
		swimlinesToDerive($store.currentTimeline, displayableTasks)
	)

	function toggleSwimlineVisibility(event: Event, id:number) {
		let value = !$store.currentTimeline.swimlines[id].isShow;
		store.update((s) => {
			s.currentTimeline.tasks.forEach((task: Task) => {
				if (task.swimlineId == id) {
					task.isShow = value;
				}
			});
			return { ...s };
		});
	}
</script>

<svg
	viewBox={$store.currentTimeline.viewbox}
	xmlns="http://www.w3.org/2000/svg"
	x="0"
	y={GRID.MILESTONE_H + GRID.ANNUAL_H - 5}
	id="svgSwimlineAndTasks"
>
	{#each displayableTasks as task, index (task.id)}
		{#if displayableSwimlines.has(task.id)}
			{@const localSwimline = displayableSwimlines.get(task.id)}
			{#if localSwimline}
				<g class="wrapperSwimline">
				<rect
					x="0"
					y={index * GRID.ONE_TASK_H}
					width={GRID.ALL_WIDTH}
					height={localSwimline.height}
					fill={COLORS[localSwimline.position % COLORS.length][0]}
					id="c{task.swimlineId}"
					role="none"
					class="www"
				/>

				<rect
					x="0"
					y={index * GRID.ONE_TASK_H}
					width={GRID.LEFT_WIDTH}
					height={localSwimline.height}
					fill={COLORS[localSwimline.position % COLORS.length][1]}
					id="d{task.swimlineId}"
					role="none"
				/>

				<text
					text-anchor="middle"
					x={GRID.LEFT_WIDTH / 2}
					y={index * GRID.ONE_TASK_H + 5 + localSwimline.height / 2}
					font-size="10"
					fill={localSwimline.swimline.isShow ? '#ffffff' : '#888888'}
					>{localSwimline.swimline.label}</text
				>

				<image
					xlink:href={localSwimline.swimline.isShow ? '/hide.png' : '/see.png'}
					x="0"
					y={index * GRID.ONE_TASK_H}
					height="24"
					width="24"
					data-html2canvas-ignore="true"
					onclick={(e) => toggleSwimlineVisibility(e, task.swimlineId)}
					onkeydown={(e) => toggleSwimlineVisibility(e, task.swimlineId)}
					id="s{task.swimlineId}"
					class="toggleVisibility"
					role="button"
					tabindex="0"
				/>
				</g>
			{/if}
		{:else}
			<rect
				x="0"
				y={index * GRID.ONE_TASK_H}
				width={GRID.ALL_WIDTH}
				height={GRID.ONE_TASK_H - 0.5}
				fill="transparent"
			/>
		{/if}
	{/each}
</svg>

<style>
    .toggleVisibility {
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.15s ease;
    }
    /* Affiche l'icône au survol du groupe ou du rectangle */
    .wrapperSwimline:hover .toggleVisibility,
	.wrapperSwimline:focus-within .toggleVisibility {
        opacity: 1;
    }
</style>
