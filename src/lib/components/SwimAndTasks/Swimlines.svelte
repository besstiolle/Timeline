<script lang="ts">
	import { COLORS, GRID } from '$lib/constantes';
	import { displayableSwimlines, displayableTasks } from '$lib/derivedStore';
	import { store } from '$lib/stores';
	import type { Task } from '$lib/struct.class';

	function toggleSwimlineVisibility(event: Event) {
		let id = Number((event.currentTarget as HTMLElement).id.substring(1));
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
	function showToggle(event: Event) {
		let id = Number((event.currentTarget as HTMLElement).id.substring(1));
		(document.getElementById('s' + id) as HTMLElement).classList.toggle('hidden');
	}
</script>

<svg
	viewBox={$store.currentTimeline.viewbox}
	xmlns="http://www.w3.org/2000/svg"
	x="0"
	y={GRID.MILESTONE_H + GRID.ANNUAL_H - 5}
	id="svgSwimlineAndTasks"
>
	{#each $displayableTasks as task, index (task.id)}
		{#if $displayableSwimlines.has(task.id)}
			{@const localSwimline = $displayableSwimlines.get(task.id)}
			{#if localSwimline}
				<rect
					x="0"
					y={index * GRID.ONE_TASK_H}
					width={GRID.ALL_WIDTH}
					height={localSwimline?.height}
					fill={COLORS[localSwimline.position % COLORS.length][0]}
					id="c{task.swimlineId}"
					onmouseover={showToggle}
					onfocus={showToggle}
					onmouseout={showToggle}
					onblur={showToggle}
					role="none"
				/>

				<rect
					x="0"
					y={index * GRID.ONE_TASK_H}
					width={GRID.LEFT_WIDTH}
					height={localSwimline.height}
					fill={COLORS[localSwimline.position % COLORS.length][1]}
					id="d{task.swimlineId}"
					onmouseover={showToggle}
					onfocus={showToggle}
					onmouseout={showToggle}
					onblur={showToggle}
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
					onclick={toggleSwimlineVisibility}
					onkeydown={toggleSwimlineVisibility}
					id="s{task.swimlineId}"
					class="toggleVisibility hidden"
					onmouseover={showToggle}
					onfocus={showToggle}
					onmouseout={showToggle}
					onblur={showToggle}
					role="button"
					tabindex="0"
				/>
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
	}
</style>
