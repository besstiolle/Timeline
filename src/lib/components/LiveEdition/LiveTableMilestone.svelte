<script lang="ts">
	import { Helpers } from '$lib/helpers';
	import { FactoryTimeline } from '$lib/factoryTimeline';
	import { FactoryMilestone } from '$lib/factoryMilestone';
	import { m } from '../../../paraglide/messages';
	import { Milestone } from '$lib/struct.class.svelte';
	import LiveTableMilestoneRow from './LiveTableMilestoneRow.svelte';
	import { appState } from '$lib/state/appState.svelte';
	import { volatileAppState } from '$lib/state/volatileAppState.svelte';

	function onDelete(index: number) {
		if (index < 0 || index > appState.currentTimeline.milestones.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		appState.currentTimeline.milestones.splice(index, 1);
	}

	function onUp(index: number) {
		if (index <= 0 || index > appState.currentTimeline.milestones.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		let tmpMilestone: Milestone = appState.currentTimeline.milestones[index];
		appState.currentTimeline.milestones[index] = appState.currentTimeline.milestones[index - 1];
		appState.currentTimeline.milestones[index - 1] = tmpMilestone;

	}
	function onDown(index: number) {
		if (index < 0 || index >= appState.currentTimeline.milestones.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		let tmpMilestone: Milestone = appState.currentTimeline.milestones[index];
		appState.currentTimeline.milestones[index] = appState.currentTimeline.milestones[index + 1];
		appState.currentTimeline.milestones[index + 1] = tmpMilestone;
	}
	function onDuplicate(index: number) {
		if (index < 0 || index > appState.currentTimeline.milestones.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		let tmpMilestones: Array<Milestone> = appState.currentTimeline.milestones.splice(
			index + 1,
			appState.currentTimeline.milestones.length
		);

		let timelineUpdated = FactoryTimeline.addMilestone(
			appState.currentTimeline,
			FactoryMilestone.duplicate(
				appState.currentTimeline.milestones[index],
				appState.currentTimeline.getNextId(),
				' (copy)'
			)
		);
		tmpMilestones.forEach((tmpMilestone) => {
			timelineUpdated = FactoryTimeline.addMilestone(timelineUpdated, tmpMilestone);
		});

		appState.currentTimeline = timelineUpdated;
	}
	function onAdd() {
		let diffSec: number =
			volatileAppState.timelineEnd.getTime() - volatileAppState.timelineStart.getTime();

		const timelineUpdated = FactoryTimeline.addMilestone(
			appState.currentTimeline,
			new Milestone(
				appState.currentTimeline.getNextId(),
				'My Milestone',
				Helpers.toYYYY_MM_DD(new Date(volatileAppState.timelineStart.getTime() + 0.5 * diffSec)),
				true
			)
		);
		appState.currentTimeline = timelineUpdated;
	}
</script>

{#each appState.currentTimeline.milestones as milestone, index (milestone.id)}
	<LiveTableMilestoneRow
		{milestone}
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
		<span>{m.live_milestone_editor_new()}</span>
	</div>
</div>
