<script lang="ts">
	import { store } from '$lib/stores';
	import { Helpers } from '$lib/helpers';
	import { FactoryTimeline } from '$lib/factoryTimeline';
	import { LIVE_PREFIX } from '$lib/constantes';
	import { FactoryMilestone } from '$lib/factoryMilestone';
	import { m } from '../../../paraglide/messages';
	import { Milestone } from '$lib/struct.class';

	const props = $props();
	const updateStore = props.updateStore as (prefix: string, position: number) => void;

	function m_delete(index: number) {
		if (index < 0 || index > $store.currentTimeline.milestones.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		store.update((s) => {
			s.currentTimeline.milestones.splice(index, 1);
			return { ...s };
		});
	}

	function m_up(index: number) {
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
	function m_down(index: number) {
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
	function m_show(index: number) {
		if (index < 0 || index > $store.currentTimeline.milestones.length - 1) {
			console.warn('index was abnormal', index);
			return;
		}
		store.update((s) => {
			s.currentTimeline.milestones[index].isShow = !s.currentTimeline.milestones[index].isShow;
			return { ...s };
		});
	}
	function m_duplicate(index: number) {
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
			FactoryMilestone.clone(
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
	function m_add() {
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
	<div class="live__line show_{milestone.isShow}">
		<div
			data-name="M{index}"
			class="live_cmd"
			onclick={() => {
				m_show(index);
			}}
			onkeydown={() => {
				m_show(index);
			}}
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
			onclick={() => {
				m_up(index);
			}}
			onkeydown={() => {
				m_up(index);
			}}
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
			onclick={() => {
				m_down(index);
			}}
			onkeydown={() => {
				m_down(index);
			}}
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
			onclick={() => {
				m_duplicate(index);
			}}
			onkeydown={() => {
				m_duplicate(index);
			}}
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
			onclick={() => {
				m_delete(index);
			}}
			onkeydown={() => {
				m_delete(index);
			}}
			title={m.live_milestone_editor_delete()}
			role="button"
			tabindex="0"
		>
			<svg viewBox="0 0 20 20">
				<use x="0" y="0" href="#b_delete" />
			</svg>
		</div>
		<input type="text" bind:value={milestone.label} class="label" />
		<input
			type="date"
			id="{LIVE_PREFIX.MD}{index}"
			value={milestone.date}
			min="1900-01-01"
			max="2999-12-31"
			onchange={() => updateStore(LIVE_PREFIX.MD, index)}
			onblur={() => updateStore(LIVE_PREFIX.MD, index)}
		/>
	</div>
{/each}

<div class="live__action">
	<div class="live__action__button" onclick={m_add} onkeydown={m_add} role="button" tabindex="0">
		<svg class="svg-icon" viewBox="0 0 20 20">
			<use x="0" y="0" href="#b_add" />
		</svg>
		<span>{m.live_milestone_editor_new()}</span>
	</div>
</div>
