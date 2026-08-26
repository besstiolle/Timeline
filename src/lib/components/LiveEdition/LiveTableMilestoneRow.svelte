<script lang="ts">
	import { store } from '$lib/stores';
	import { LIVE_PREFIX } from '$lib/constantes';
	import { m } from '../../../paraglide/messages';
	import { Milestone } from '$lib/struct.class';
	import { untrack } from 'svelte';
	import { MilestoneValidator } from '$lib/milestoneValidator';

	interface Props {
		milestone: Milestone;
		index: number;
		onDelete: (index: number) => void;
		onUp: (index: number) => void;
		onDown: (index: number) => void;
		onDuplicate: (index: number) => void;
	}

	let { milestone, index, onDelete, onUp, onDown, onDuplicate }: Props = $props();

	// Reactive local buffer for dates
    // untrack() tells Svelte that the initial capture of the prop is intentional
    let localDate = $state(untrack(() => milestone.date));


	// Reactive validation
	let isDateValid = $derived(MilestoneValidator.isValidDateString(localDate));

	$inspect(isDateValid)

	// Try updating the store for the date
	function handleDateChange() {
		if (isDateValid && localDate !== milestone.date) {
			store.update((s) => {
				console.info("update Field Date", localDate)
				milestone.date = localDate;
				return { ...s };
			});
		}
	}

	// Try updating the store for the other field
    function updateMilestoneField<K extends keyof Milestone>(field: K, value: Milestone[K]) {
		store.update((s) => {
			milestone[field] = value;
			return { ...s };
		});
	}

</script>

<div class="live__line show_{milestone.isShow}">
	<div
		data-name="M{index}"
		class="live_cmd"
		onclick={() => updateMilestoneField('isShow', !milestone.isShow)}
		onkeydown={() => updateMilestoneField('isShow', !milestone.isShow)}
		title={m.live_milestone_editor_toggle()}
		role="button"
		tabindex="0"
	>
		<svg viewBox="0 0 20 20">
			<use x="0" y="0" href="#b_show" />
		</svg>
	</div>
	<div
		data-name="M{index}"
		class="live_cmd"
		onclick={() => {onUp(index);}}
		onkeydown={() => {onUp(index);}}
		title={m.live_milestone_editor_down()}
		role="button"
		tabindex="0"
	>
		<svg viewBox="0 0 20 20">
			<use x="0" y="0" href="#b_up" />
		</svg>
	</div>
	<div
		data-name="M{index}"
		class="live_cmd"
		onclick={() => {onDown(index);}}
		onkeydown={() => {onDown(index);}}
		title={m.live_milestone_editor_up()}
		role="button"
		tabindex="0"
	>
		<svg viewBox="0 0 20 20">
			<use x="0" y="0" href="#b_down" />
		</svg>
	</div>
	<div
		data-name="M{index}"
		class="live_cmd"
		onclick={() => {onDuplicate(index);}}
		onkeydown={() => {onDuplicate(index);}}
		title={m.live_milestone_editor_clone()}
		role="button"
		tabindex="0"
	>
		<svg viewBox="0 0 20 20">
			<use x="0" y="0" href="#b_duplicate" />
		</svg>
	</div>
	<div
		data-name="M{index}"
		class="live_cmd live_cmd_red"
		onclick={() => {onDelete(index);}}
		onkeydown={() => {onDelete(index);}}
		title={m.live_milestone_editor_delete()}
		role="button"
		tabindex="0"
	>
		<svg viewBox="0 0 20 20">
			<use x="0" y="0" href="#b_delete" />
		</svg>
	</div>
	<input 
		type="text" 
		value={milestone.label} 
		class="label" 
		oninput={(e) => updateMilestoneField('label', e.currentTarget.value)}
	/>
	<input
		type="date"
		id="{LIVE_PREFIX.MD}{index}"
		bind:value={localDate}
		class:date_warn={!isDateValid}
		oninput={handleDateChange}
		min="1900-01-01"
		max="2999-12-31"
	/>
</div>

<style>
	.date_warn {
		background-color: #ff9800;
	}
</style>