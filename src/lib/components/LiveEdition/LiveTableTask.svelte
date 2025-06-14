<script lang="ts">
	import { store } from '$lib/stores';
	import { Helpers } from '$lib/helpers';
	import { FactoryTimeline } from '$lib/factoryTimeline';
	import { LIVE_PREFIX } from '$lib/constantes';
	import { FactoryTask } from '$lib/factoryTask';
	import { m } from '../../../paraglide/messages';
	import { Task } from '$lib/struct.class';

	const props = $props();
	const updateStore = props.updateStore as (prefix: string, position: number) => void;

	function updateProgression(position: number) {
		let elm = document.getElementById(LIVE_PREFIX.PR + position) as HTMLInputElement;
		let value = 0;
		if (elm.value.match(/^([0-9]+)$/g)) {
			value = parseInt(elm.value);
		}

		if (value > 100) {
			value = 100;
		}

		store.update((s) => {
			s.currentTimeline.tasks[position].progress = value;
			return { ...s };
		});
	}

	function b_delete(index: number) {
		if (index < 0 || index > $store.currentTimeline.tasks.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		store.update((s) => {
			s.currentTimeline.tasks.splice(index, 1);
			return { ...s };
		});
	}
	
	function b_up(index: number) {
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
	function b_down(index: number) {
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
	function b_show(index: number) {
		if (index < 0 || index > $store.currentTimeline.tasks.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		store.update((s) => {
			s.currentTimeline.tasks[index].isShow = !s.currentTimeline.tasks[index].isShow;
			return { ...s };
		});
	}
	function b_duplicate(index: number) {
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
			FactoryTask.clone(
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

	function b_add() {
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
	<div class="live__line show_{task.isShow}">
		<div class="live__input_top">
			<div
				class="live_cmd"
				onclick={() => {
					b_show(index);
				}}
				onkeydown={() => {
					b_show(index);
				}}
				title={m.live_task_editor_toggle()}
				role="button"
				tabindex="0"
			>
				<svg viewBox="0 0 20 20">
					<use x="0" y="0" href="#b_show" />
				</svg>
			</div>
			<div
				class="live_cmd"
				onclick={() => {
					b_up(index);
				}}
				onkeydown={() => {
					b_up(index);
				}}
				title={m.live_task_editor_down()}
				role="button"
				tabindex="0"
			>
				<svg viewBox="0 0 20 20">
					<use x="0" y="0" href="#b_up" />
				</svg>
			</div>
			<div
				class="live_cmd"
				onclick={() => {
					b_down(index);
				}}
				onkeydown={() => {
					b_down(index);
				}}
				title={m.live_task_editor_up()}
				role="button"
				tabindex="0"
			>
				<svg viewBox="0 0 20 20">
					<use x="0" y="0" href="#b_down" />
				</svg>
			</div>
			<div
				class="live_cmd"
				onclick={() => {
					b_duplicate(index);
				}}
				onkeydown={() => {
					b_duplicate(index);
				}}
				title={m.live_task_editor_clone()}
				role="button"
				tabindex="0"
			>
				<svg viewBox="0 0 20 20">
					<use x="0" y="0" href="#b_duplicate" />
				</svg>
			</div>
			<div
				class="live_cmd live_cmd_red"
				onclick={() => {
					b_delete(index);
				}}
				onkeydown={() => {
					b_delete(index);
				}}
				title={m.live_task_editor_delete()}
				role="button"
				tabindex="0"
			>
				<svg viewBox="0 0 20 20">
					<use x="0" y="0" href="#b_delete" />
				</svg>
			</div>
			<input type="text" bind:value={task.label} class="label" />
			<input
				type="date"
				id="{LIVE_PREFIX.TS}{index}"
				value={task.dateStart}
				min="1900-01-01"
				max="2999-12-31"
				onchange={() => updateStore(LIVE_PREFIX.TS, index)}
				onblur={() => updateStore(LIVE_PREFIX.TS, index)}
			/>
			<input
				type="date"
				id="{LIVE_PREFIX.TE}{index}"
				value={task.dateEnd}
				min="1900-01-01"
				max="2999-12-31"
				onchange={() => updateStore(LIVE_PREFIX.TE, index)}
				onblur={() => updateStore(LIVE_PREFIX.TE, index)}
			/>
			<input type="text" bind:value={task.swimline} class="label" />
			<input
				type="number"
				id="{LIVE_PREFIX.PR}{index}"
				value={task.progress}
				min="0"
				max="100"
				class="progress"
				onchange={() => updateProgression(index)}
				onblur={() => updateProgression(index)}
			/>
			<progress max="100" value={task.progress}> {task.progress}% </progress>
			<label for="hasProgress{index}">{m.live_task_editor_show_progress()} : </label><input
				type="checkbox"
				bind:checked={task.hasProgress}
				name="hasProgress{index}"
				id="hasProgress{index}"
			/>
		</div>
	</div>
{/each}
<div class="live__action">
	<div class="live__action__button" onclick={b_add} onkeydown={b_add} role="button" tabindex="0">
		<svg class="svg-icon" viewBox="0 0 20 20">
			<use x="0" y="0" href="#b_add" />
		</svg>
		<span>{m.live_task_editor_new()}</span>
	</div>
</div>
