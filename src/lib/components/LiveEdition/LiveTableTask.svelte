<script lang="ts">
	import { store } from '$lib/stores';
	import { Helpers } from '$lib/helpers';
	import { FactoryTimeline } from '$lib/factoryTimeline';
	import { FactoryTask } from '$lib/factoryTask';
	import { m } from '../../../paraglide/messages';
	import { Task } from '$lib/struct.class';
	import LiveTableTaskRow from './LiveTableTaskRow.svelte';

	function onDelete(index: number) {
		if (index < 0 || index > $store.currentTimeline.tasks.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		store.update((s) => {
			s.currentTimeline.tasks.splice(index, 1);
			return { ...s };
		});
	}

	function onUp(index: number) {
		if (index <= 0 || index > $store.currentTimeline.tasks.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		let tmpTask: Task = $store.currentTimeline.tasks[index];
		store.update((s) => {
			s.currentTimeline.tasks[index] = s.currentTimeline.tasks[index - 1];
			s.currentTimeline.tasks[index - 1] = tmpTask;
			return { ...s };
		});
	}
	function onDown(index: number) {
		if (index < 0 || index >= $store.currentTimeline.tasks.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		let tmpTask: Task = $store.currentTimeline.tasks[index];

		store.update((s) => {
			s.currentTimeline.tasks[index] = s.currentTimeline.tasks[index + 1];
			s.currentTimeline.tasks[index + 1] = tmpTask;
			return { ...s };
		});
	}
	function onDuplicate(index: number) {
		if (index < 0 || index > $store.currentTimeline.tasks.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		let tmpTasks: Array<Task> = $store.currentTimeline.tasks.splice(
			index + 1,
			$store.currentTimeline.tasks.length
		);

		let timelineUpdated = FactoryTimeline.addTask(
			$store.currentTimeline,
			FactoryTask.duplicate(
				$store.currentTimeline.tasks[index],
				$store.currentTimeline.getNextId(),
				' (copy)'
			)
		);

		tmpTasks.forEach((tmpTask) => {
			timelineUpdated = FactoryTimeline.addTask(timelineUpdated, tmpTask);
		});

		store.update((s) => {
			s.currentTimeline = timelineUpdated;
			return { ...s };
		});
	}

	function onAdd() {
		let diffSec: number =
			$store.currentTimeline.getEndTime() - $store.currentTimeline.getStartTime();
		const timelineUpdated = FactoryTimeline.addTask(
			$store.currentTimeline,
			new Task(
				$store.currentTimeline.getNextId(),
				'Some task',
				Helpers.toYYYY_MM_DD(new Date($store.currentTimeline.getStartTime() + 0.1 * diffSec)),
				Helpers.toYYYY_MM_DD(new Date($store.currentTimeline.getEndTime() - 0.1 * diffSec)),
				true,
				0,
				true,
				'',
				-1
			)
		);

		store.update((s) => {
			s.currentTimeline = timelineUpdated;
			return { ...s };
		});
	}

</script>

{#each $store.currentTimeline.tasks as task, index (task.id)}
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
