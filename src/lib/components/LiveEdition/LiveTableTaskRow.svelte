<script lang="ts">
	import { Task } from '$lib/struct.class';
	import { store } from '$lib/stores';
	import { TaskValidator } from '$lib/taskValidator';
	import { m } from '../../../paraglide/messages';
	import { untrack } from 'svelte';

	interface Props {
		task: Task;
		index: number;
		onDelete: (index: number) => void;
		onUp: (index: number) => void;
		onDown: (index: number) => void;
		onDuplicate: (index: number) => void;
	}

	let { task, index, onDelete, onUp, onDown, onDuplicate }: Props = $props();

	// Reactive local buffer for dates
    // untrack() tells Svelte that the initial capture of the prop is intentional
    let localDateStart = $state(untrack(() => task.dateStart));
	let localDateEnd = $state(untrack(() => task.dateEnd));
	let localProgression = $state(untrack(() => task.progress));

	// Reactive validation
	let isStartValid = $derived(TaskValidator.isStartDateValid(localDateStart, localDateEnd));
	let isEndValid = $derived(TaskValidator.isEndDateValid(localDateStart, localDateEnd));

	// Try updating the store for the start date AND the end date to fix 
	// 		"The wrong date is displayed #7" https://github.com/besstiolle/Timeline/issues/7
	function handleDateChange() {
		if (isStartValid && localDateStart !== task.dateStart) {
			store.update((s) => {
				task.dateStart = localDateStart;
				return { ...s };
			});
		}

		if (isEndValid && localDateEnd !== task.dateEnd) {
			store.update((s) => {
				task.dateEnd = localDateEnd;
				return { ...s };
			});
		}
	}
    
	// Try updating the store for the progression field
	function handleProgressionChange() {
		const progression = TaskValidator.getValideProgression(localProgression)
        store.update((s) => {
            task.progress = progression;
            return { ...s };
        });
	}

	// Try updating the store for the other field
    function updateTaskField<K extends keyof Task>(field: K, value: Task[K]) {
		store.update((s) => {
			task[field] = value;
			return { ...s };
		});
	}
</script>

<div class="live__line show_{task.isShow}">
	<div class="live__input_top">
		<!-- Boutons de commande -->
		<div class="live_cmd" onclick={() => updateTaskField('isShow', !task.isShow)} onkeydown={() => updateTaskField('isShow', !task.isShow)} role="button" tabindex="0">
			<svg viewBox="0 0 20 20"><use href="#b_show" /></svg>
		</div>
		<div class="live_cmd" onclick={() => onUp(index)} onkeydown={() => onUp(index)} role="button" tabindex="0">
			<svg viewBox="0 0 20 20"><use href="#b_up" /></svg>
		</div>
		<div class="live_cmd" onclick={() => onDown(index)} onkeydown={() => onDown(index)} role="button" tabindex="0">
			<svg viewBox="0 0 20 20"><use href="#b_down" /></svg>
		</div>
		<div class="live_cmd" onclick={() => onDuplicate(index)} onkeydown={() => onDuplicate(index)} role="button" tabindex="0">
			<svg viewBox="0 0 20 20"><use href="#b_duplicate" /></svg>
		</div>
		<div class="live_cmd live_cmd_red" onclick={() => onDelete(index)} onkeydown={() => onDelete(index)} role="button" tabindex="0">
			<svg viewBox="0 0 20 20"><use href="#b_delete" /></svg>
		</div>

		<!-- Text and Boolean fields: instant responsiveness in the store/SVG -->
        <!-- FIXME: Replace the JS function with `bind:value` when possible -->
		<input 
            type="text" 
            value={task.label} 
            class="label" 
			oninput={(e) => updateTaskField('label', e.currentTarget.value)}
        />

		<!-- Dates: based on the local timestamp + conditional store update -->
		<input
			type="date"
			bind:value={localDateStart}
			class:date_warn={!isStartValid}
			onchange={handleDateChange}
			onblur={handleDateChange}
			min="1900-01-01"
			max="2999-12-31"
		/>

		<input
			type="date"
			bind:value={localDateEnd}
			class:date_warn={!isEndValid}
			onchange={handleDateChange}
			onblur={handleDateChange}
			min="1900-01-01"
			max="2999-12-31"
		/>

		<input 
            type="text" 
            value={task.swimline} 
            class="label" 
			oninput={(e) => updateTaskField('swimline', e.currentTarget.value)}
        />

		<input
			type="number"
			bind:value={localProgression}
			oninput={handleProgressionChange}
			min="0"
			max="100"
			class="progress"
		/>
		<progress max="100" value={task.progress}>{task.progress}%</progress>

		<label for="hasProgress{index}">{m.live_task_editor_show_progress()} : </label>
		<input
			type="checkbox"
			checked={task.hasProgress}
			id="hasProgress{index}"
			onchange={(e) => updateTaskField('hasProgress', e.currentTarget.checked)}
			onblur={(e) => updateTaskField('hasProgress', e.currentTarget.checked)}
		/>
	</div>
</div>


<style>
	.date_warn {
		background-color: #ff9800;
	}
</style>