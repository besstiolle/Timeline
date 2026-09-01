import { FactoryMilestone } from "$lib/factoryMilestone";
import type { Milestone, Timeline } from "$lib/struct.class.svelte";


/**
 * return all the Milestones to display
 **/
export function displayableMilestones(timeline: Timeline): Milestone[] {
	const showAll = timeline.showAll;

	return timeline.milestones
		.filter((milestone) => showAll || milestone.isShow)
		.sort(FactoryMilestone.compare);
};