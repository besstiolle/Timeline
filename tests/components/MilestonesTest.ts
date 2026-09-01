import { describe, it, expect, vi } from 'vitest';
import { Milestone, Timeline } from '$lib/struct.class.svelte';
import { FactoryMilestone } from '$lib/factoryMilestone';
import { displayableMilestones } from '$lib/components/Milestones/Milestones';

describe('displayableMilestones()', () => {
	it('should filter out hidden milestones when timeline.showAll is false', () => {
		const m1 = new Milestone(1, 'M1', '2023-01-01', true);
		const m2 = new Milestone(2, 'M2', '2023-02-01', false); // Hidden
		const timeline = new Timeline();
		timeline.milestones = [m1, m2];
		timeline.showAll = false;

		const result = displayableMilestones(timeline);

		expect(result).toHaveLength(1);
		expect(result[0]).toBe(m1);
	});

	it('should return all milestones when timeline.showAll is true', () => {
		const m1 = new Milestone(1, 'M1', '2023-01-01', true);
		const m2 = new Milestone(2, 'M2', '2023-02-01', false);
		const timeline = new Timeline();
		timeline.milestones = [m1, m2];
		timeline.showAll = true;

		const result = displayableMilestones(timeline);

		expect(result).toHaveLength(2);
	});

	it('should sort milestones using FactoryMilestone.compare', () => {
		const compareSpy = vi.spyOn(FactoryMilestone, 'compare');
		const m1 = new Milestone(1, 'M1', '2023-05-01', true);
		const m2 = new Milestone(2, 'M2', '2023-01-01', true);
		const timeline = new Timeline();
		timeline.milestones = [m1, m2];

		displayableMilestones(timeline);

		expect(compareSpy).toHaveBeenCalled();
	});
});