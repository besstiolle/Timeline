<script lang="ts">
	import { store } from '$lib/stores';
	import { Helpers } from '$lib/helpers';
	import { FactoryTimeline } from '$lib/factoryTimeline';
	import { FactoryMilestone } from '$lib/factoryMilestone';
	import { m } from '../../../paraglide/messages';
	import { Milestone } from '$lib/struct.class';
	import LiveTableMilestoneRow from './LiveTableMilestoneRow.svelte';

	function onDelete(index: number) {
		if (index < 0 || index > $store.currentTimeline.milestones.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		store.update((s) => {
			s.currentTimeline.milestones.splice(index, 1);
			return { ...s };
		});
	}

	function onUp(index: number) {
		if (index <= 0 || index > $store.currentTimeline.milestones.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		let tmpMilestone: Milestone = $store.currentTimeline.milestones[index];
		store.update((s) => {
			s.currentTimeline.milestones[index] = s.currentTimeline.milestones[index - 1];
			s.currentTimeline.milestones[index - 1] = tmpMilestone;
			return { ...s };
		});
	}
	function onDown(index: number) {
		if (index < 0 || index >= $store.currentTimeline.milestones.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		let tmpMilestone: Milestone = $store.currentTimeline.milestones[index];
		store.update((s) => {
			s.currentTimeline.milestones[index] = s.currentTimeline.milestones[index + 1];
			s.currentTimeline.milestones[index + 1] = tmpMilestone;
			return { ...s };
		});
	}
	function onDuplicate(index: number) {
		if (index < 0 || index > $store.currentTimeline.milestones.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		let tmpMilestones: Array<Milestone> = $store.currentTimeline.milestones.splice(
			index + 1,
			$store.currentTimeline.milestones.length
		);

		let timelineUpdated = FactoryTimeline.addMilestone(
			$store.currentTimeline,
			FactoryMilestone.duplicate(
				$store.currentTimeline.milestones[index],
				$store.currentTimeline.getNextId(),
				' (copy)'
			)
		);
		tmpMilestones.forEach((tmpMilestone) => {
			timelineUpdated = FactoryTimeline.addMilestone(timelineUpdated, tmpMilestone);
		});

		store.update((s) => {
			s.currentTimeline = timelineUpdated;
			return { ...s };
		});
	}
	function onAdd() {
		let diffSec: number =
			$store.currentTimeline.getEnd().getTime() - $store.currentTimeline.getStart().getTime();

		const timelineUpdated = FactoryTimeline.addMilestone(
			$store.currentTimeline,
			new Milestone(
				$store.currentTimeline.getNextId(),
				'My Milestone',
				Helpers.toYYYY_MM_DD(new Date($store.currentTimeline.getStart().getTime() + 0.5 * diffSec)),
				true
			)
		);
		store.update((s) => {
			s.currentTimeline = timelineUpdated;
			return { ...s };
		});
	}
</script>

{#each $store.currentTimeline.milestones as milestone, index (milestone.id)}
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
