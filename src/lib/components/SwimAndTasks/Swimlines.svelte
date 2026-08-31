<script lang="ts">
	import { COLORS, GRID } from '$lib/constantes';
	import { FactorySwimline } from '$lib/factorySwimline';
	import { Helpers } from '$lib/helpers';
	import { appState } from '$lib/state/appState.svelte';
	import type { Task } from '$lib/struct.class.svelte';
	import { displayableSwimlines, displayableTasks, type swimlinesToShowInterface} from './SwimAndTasks';


	const tasksToShow = $derived(displayableTasks());
	const swimlinesToShow = $derived(displayableSwimlines());
	

	function toggleSwimlineVisibility(event: Event, id:number) {
		const tasksVisiblesForThisSwimline = FactorySwimline.countVisibleTasksInListForSwimlineName(appState.currentTimeline.tasks, appState.currentTimeline.swimlines[id].label)
		const value = !(tasksVisiblesForThisSwimline > 0)
		appState.currentTimeline.tasks.forEach((task: Task) => {
			if (task.swimlineId == id) {
				task.isShow = value;
			}
		});
	}

	function isSwimlineVisible(s:swimlinesToShowInterface){
		return FactorySwimline.hasVisibleTasksInListForSwimlineName(appState.currentTimeline.tasks, s.swimline.label)
	}

</script>

<svg
	viewBox={appState.currentTimeline.viewbox}
	xmlns="http://www.w3.org/2000/svg"
	x="0"
	y={GRID.MILESTONE_H + GRID.ANNUAL_H - 5}
	id="svgSwimlineAndTasks"
>
	{#each tasksToShow as task, index (task.id)}
		{#if swimlinesToShow.has(task.id)}
			{@const localSwimline = swimlinesToShow.get(task.id)}
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
					fill={isSwimlineVisible(localSwimline) ? '#ffffff' : '#888888'}
					>{localSwimline.swimline.label}</text
				>

				<image
					xlink:href={isSwimlineVisible(localSwimline) ? '/hide.png' : '/see.png'}
					x="0"
					y={index * GRID.ONE_TASK_H}
					height="24"
					width="24"
					data-html2canvas-ignore="true"
					onclick={(e) => toggleSwimlineVisibility(e, Helpers.hashString(task.swimlineId))}
					onkeydown={(e) => toggleSwimlineVisibility(e, Helpers.hashString(task.swimlineId))}
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
