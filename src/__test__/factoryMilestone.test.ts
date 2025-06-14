import { describe, expect, it, vi } from 'vitest';
import { FactoryMilestone } from '$lib/factoryMilestone';
import { NotFoundException } from '$lib/timelineException.class';
import { Milestone, Timeline } from '$lib/struct.class';

//Mock console.error() to avoid vi console pollution
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('FactoryMilestone.join', () => {
	const milestone: Milestone = new Milestone(1, 'label', '2020-01-01', true);
	const result: string = 'milestone;label;true;2020-01-01';
	it('FactoryMilestone.join with nominal values', () => {
		expect(FactoryMilestone.join(milestone, ';')).toBe(result);
	});
});

describe('FactoryMilestone.getById ', () => {
	const milestone1: Milestone = new Milestone(1, 'label 1', '2020-01-01', true);
	const milestone2: Milestone = new Milestone(2, 'label 2', '2020-01-01', true);
	const milestone3: Milestone = new Milestone(3, 'label 3', '2020-01-01', true);
	const milestone4: Milestone = new Milestone(4, 'label 4', '2020-01-01', true);
	const timeline = new Timeline('key', 'title');
	timeline.milestones.push(milestone1);
	timeline.milestones.push(milestone2);
	timeline.milestones.push(milestone3);
	timeline.milestones.push(milestone4);

	it('FactoryMilestone.getById with nominal values', () => {
		expect(FactoryMilestone.getById(timeline, 2)).toBe(milestone2);
	});

	it('FactoryMilestone.getById with unknow values', () => {
		expect(() => {
			FactoryMilestone.getById(timeline, 10);
		}).toThrow(NotFoundException);
	});
});

describe('FactoryMilestone.clone ', () => {
	const milestone1: Milestone = new Milestone(1, 'label 1', '2020-01-01', true);
	const milestone2 = FactoryMilestone.clone(milestone1);

	it('FactoryTask.clone and check memory pointer', () => {
		expect(milestone1).not.toBe(milestone2);
		expect(milestone1).toStrictEqual(milestone2);
	});
});

describe('FactoryMilestone.updateById ', () => {
	const milestone1: Milestone = new Milestone(1, 'label 1', '2020-01-01', true);
	const milestone2: Milestone = new Milestone(2, 'label 2', '2020-01-01', true);
	const milestone2b: Milestone = new Milestone(2, 'label 2b', '2020-01-01', true);
	const milestone3: Milestone = new Milestone(3, 'label 3', '2020-01-01', true);
	const milestone4: Milestone = new Milestone(4, 'label 4', '2020-01-01', true);
	const milestone10: Milestone = new Milestone(10, 'label 10', '2020-01-01', true);
	let timeline = new Timeline('key', 'title');
	timeline.milestones.push(milestone1);
	timeline.milestones.push(milestone2);
	timeline.milestones.push(milestone3);
	timeline.milestones.push(milestone4);

	it('FactoryMilestone.getById with nominal values', () => {
		timeline = FactoryMilestone.updateById(timeline, milestone2b);
		expect(FactoryMilestone.getById(timeline, 2)).toBe(milestone2b);
	});

	it('FactoryMilestone.getById with unknow values', () => {
		expect(() => {
			FactoryMilestone.updateById(timeline, milestone10);
		}).toThrow(NotFoundException);
	});
});

describe('FactoryMilestone.compare ', () => {
	const milestone1: Milestone = new Milestone(1, 'label 1', '2020-01-01', true);
	const milestone2: Milestone = new Milestone(2, 'label 2', '2020-01-02', true);
	const milestone3: Milestone = new Milestone(3, 'label 3', '2020-01-03', true);
	const milestone4: Milestone = new Milestone(4, 'label 4', '2020-01-04', true);

	const milestones: Milestone[] = [];

	milestones.push(milestone4);
	milestones.push(milestone1);
	milestones.push(milestone3);
	milestones.push(milestone2);

	const milestonesSorted = milestones.sort(FactoryMilestone.compare);

	it('Sorting Milestones', () => {
		expect(() => {
			expect(milestonesSorted[0]).toBe(milestone1);
			expect(milestonesSorted[1]).toBe(milestone2);
			expect(milestonesSorted[2]).toBe(milestone3);
			expect(milestonesSorted[3]).toBe(milestone4);
		});
	});
});
