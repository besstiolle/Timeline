<script lang="ts">
	import { Helpers } from '$lib/helpers';
	import { FactoryTimeline } from '$lib/factoryTimeline';
	import { FactoryTask } from '$lib/factoryTask';
	import { m } from '../../../paraglide/messages';
	import { Task } from '$lib/struct.class.svelte';
	import LiveTableTaskRow from './LiveTableTaskRow.svelte';
	import { appState } from '$lib/state/appState.svelte';
	import { volatileAppState } from '$lib/state/volatileAppState.svelte';

	function onDelete(index: number) {
		if (index < 0 || index > appState.currentTimeline.tasks.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		appState.currentTimeline.tasks.splice(index, 1);
	}

	function onUp(index: number) {
		if (index <= 0 || index > appState.currentTimeline.tasks.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		let tmpTask: Task = appState.currentTimeline.tasks[index];
		appState.currentTimeline.tasks[index] = appState.currentTimeline.tasks[index - 1];
		appState.currentTimeline.tasks[index - 1] = tmpTask;
	}
	function onDown(index: number) {
		if (index < 0 || index >= appState.currentTimeline.tasks.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		let tmpTask: Task = appState.currentTimeline.tasks[index];
		appState.currentTimeline.tasks[index] = appState.currentTimeline.tasks[index + 1];
		appState.currentTimeline.tasks[index + 1] = tmpTask;
	}
	function onDuplicate(index: number) {
		if (index < 0 || index > appState.currentTimeline.tasks.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		let tmpTasks: Array<Task> = appState.currentTimeline.tasks.splice(
			index + 1,
			appState.currentTimeline.tasks.length
		);

		let timelineUpdated = FactoryTimeline.addTask(
			appState.currentTimeline,
			FactoryTask.duplicate(
				appState.currentTimeline.tasks[index],
				appState.currentTimeline.getNextId(),
				' (copy)'
			)
		);

		tmpTasks.forEach((tmpTask) => {
			timelineUpdated = FactoryTimeline.addTask(timelineUpdated, tmpTask);
		});

		appState.currentTimeline = timelineUpdated;
	}

	function onAdd() {
		let diffSec: number =
			appState.currentTimeline.end.getTime() - appState.currentTimeline.start.getTime();
		const timelineUpdated = FactoryTimeline.addTask(
			appState.currentTimeline,
			new Task(
				appState.currentTimeline.getNextId(),
				'Some task',
				Helpers.toYYYY_MM_DD(new Date(appState.currentTimeline.start.getTime() + 0.1 * diffSec)),
				Helpers.toYYYY_MM_DD(new Date(appState.currentTimeline.end.getTime() - 0.1 * diffSec)),
				true,
				0,
				true,
				'',
				-1
			)
		);

		appState.currentTimeline = timelineUpdated;
	}

</script>

{#each appState.currentTimeline.tasks as task, index (task.id)}
	<LiveTableTaskRow
		{task}
		{index}
		onDelete={onDelete}
		onUp={onUp}
		onDown={onDown}
		onDuplicate={onDuplicate}
	/>
{/each}
<div class="live__action">
	<div class="live__action__button" onclick={onAdd} onkeydown={onAdd} role="button" tabindex="0">
		<svg class="svg-icon" viewBox="0 0 20 20">
			<use x="0" y="0" href="#b_add" />
		</svg>
		<span>{m.live_task_editor_new()}</span>
	</div>
</div>
