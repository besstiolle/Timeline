import { describe, expect, it, vi } from 'vitest';

import { FactoryTimeline } from '$lib/factoryTimeline';
import { DuplicateEntityException } from '$lib/timelineException.class';
import { Milestone, Task, Timeline } from '$lib/struct.class.svelte';
import { DIFF } from '$lib/constantes';


//Mock console.error() to avoid vi console pollution
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('test FactoryTimeline.getMin', () => {
	const date1: string = '2020-01-01';
	const date2: string = '2021-12-02';
	const date3: string = '2019-12-03';
	const date4: string = '2021-02-04';
	const date5: string = '2000-01-05';
	const date6: string = '2018-02-06';


	it('Helpers.getMin with minimal value in task.end and task.start with/out show all', () => {

		const tasks = []
		const milestones = []

		tasks.push(new Task(1, 'label 1', date1, date4, true, 100, false, 'Swimline 1'));
		tasks.push(new Task(2, 'label 2', date2, date1, true, 100, true, 'Swimline 1'));
		tasks.push(new Task(3, 'label 3', date3, date2, true, 100, false, 'Swimline 1'));
		tasks.push(new Task(4, 'label 4', date4, date5, true, 100, true, 'Swimline 1'));

		milestones.push(new Milestone(1, 'label 1', date2, false));
		milestones.push(new Milestone(2, 'label 2', date2, true));
		milestones.push(new Milestone(3, 'label 3', date2, true));
		milestones.push(new Milestone(4, 'label 4', date2, false));

		console.info(FactoryTimeline.getMin(tasks, milestones, false))

		expect(FactoryTimeline.getMin(tasks, milestones, true)).toEqual(new Date(date3));
		expect(FactoryTimeline.getMin(tasks, milestones, false)).toEqual(new Date(date4));
	});


	it('Helpers.getMin with minimal value in milestone and with/out show all', () => {

		const tasks = []
		const milestones = []

		tasks.push(new Task(1, 'label 1', date1, date4, true, 100, false, 'Swimline 1'));
		tasks.push(new Task(2, 'label 2', date2, date1, true, 100, true, 'Swimline 1'));
		tasks.push(new Task(3, 'label 3', date3, date2, true, 100, false, 'Swimline 1'));
		tasks.push(new Task(4, 'label 4', date4, date5, true, 100, true, 'Swimline 1'));

		milestones.push(new Milestone(1, 'label 1', date2, false));
		milestones.push(new Milestone(2, 'label 2', date2, true));
		milestones.push(new Milestone(3, 'label 3', date2, true));
		milestones.push(new Milestone(4, 'label 4', date2, true));
		milestones.push(new Milestone(5, 'label 5', date6, false));

		expect(FactoryTimeline.getMin(tasks, milestones, true)).toEqual(new Date(date6));
		expect(FactoryTimeline.getMin(tasks, milestones, false)).toEqual(new Date(date4));
	});


});

describe('test FactoryTimeline.getMax', () => {
	const date1: string = '2020-01-01';
	const date2: string = '2021-12-31';
	const date3: string = '2019-12-31';
	const date4: string = '2021-02-15';
	const date5: string = '2000-01-00';
	const date6: string = '2030-02-15';


	it('Helpers.getMax with maximal value in task.end and task.start', () => {

		const tasks = []
		const milestones = []

		tasks.push(new Task(1, 'label 1', date1, date4, true, 100, true, 'Swimline 1'));
		tasks.push(new Task(2, 'label 2', date6, date1, true, 100, true, 'Swimline 1'));
		tasks.push(new Task(3, 'label 3', date3, date2, true, 100, false, 'Swimline 1'));
		tasks.push(new Task(4, 'label 4', date4, date5, true, 100, true, 'Swimline 1'));

		milestones.push(new Milestone(1, 'label 1', date4, true));
		milestones.push(new Milestone(2, 'label 2', date4, true));
		milestones.push(new Milestone(3, 'label 3', date4, false));
		milestones.push(new Milestone(4, 'label 4', date4, false));

		expect(FactoryTimeline.getMax(tasks, milestones, true)).toEqual(new Date(date2));
		expect(FactoryTimeline.getMax(tasks, milestones, false)).toEqual(new Date(date4));
	});

	it('FactoryTimeline.getMax with maximal value in milestone', () => {

		const tasks = []
		const milestones = []

		tasks.push(new Task(1, 'label 1', date1, date4, true, 100, true, 'Swimline 1'));
		tasks.push(new Task(2, 'label 2', date6, date1, true, 100, true, 'Swimline 1'));
		tasks.push(new Task(3, 'label 3', date3, date4, true, 100, true, 'Swimline 1'));
		tasks.push(new Task(4, 'label 4', date4, date5, true, 100, true, 'Swimline 1'));

		milestones.push(new Milestone(1, 'label 1', date4, true));
		milestones.push(new Milestone(2, 'label 2', date4, true));
		milestones.push(new Milestone(3, 'label 3', date4, true));
		milestones.push(new Milestone(4, 'label 4', date4, false));
		milestones.push(new Milestone(5, 'label 5', date2, false));

		expect(FactoryTimeline.getMax(tasks, milestones, true)).toEqual(new Date(date2));
		expect(FactoryTimeline.getMax(tasks, milestones, false)).toEqual(new Date(date4));
	});
});

describe('test FactoryTimeline.addTask', () => {
	let timeline = new Timeline('key', 'title');
	const date1: string = '2020-01-01';
	const date2: string = '2021-12-31';

	timeline = FactoryTimeline.addTask(
		timeline,
		new Task(1, 'label 1', date1, date2, true, 100, true, 'Swimline 1')
	);
	timeline = FactoryTimeline.addTask(
		timeline,
		new Task(2, 'label 2', date1, date2, true, 100, true, 'Swimline 1')
	);
	timeline = FactoryTimeline.addTask(
		timeline,
		new Task(3, 'label 3', date1, date2, true, 100, true, 'Swimline 1')
	);

	it('FactoryTimeline.addTask with nominal value', () => {
		expect(timeline.tasks.length).toBe(3);
		expect(timeline.isInitiate).toBe(true);
	});

	it('FactoryTimeline.addTask with duplicate id', () => {
		expect(() => {
			timeline = FactoryTimeline.addTask(
				timeline,
				new Task(3, 'label 3', date1, date2, true, 100, true, 'Swimline 1')
			);
		}).toThrow(DuplicateEntityException);
	});
});

describe('test FactoryTimeline.addMilestone', () => {
	let timeline = new Timeline('key', 'title');
	const date1: string = '2020-01-01';

	timeline = FactoryTimeline.addMilestone(timeline, new Milestone(1, 'label 1', date1, true));
	timeline = FactoryTimeline.addMilestone(timeline, new Milestone(2, 'label 2', date1, true));
	timeline = FactoryTimeline.addMilestone(timeline, new Milestone(3, 'label 3', date1, true));

	it('FactoryTimeline.addMilestone with nominal value', () => {
		expect(timeline.milestones.length).toBe(3);
		expect(timeline.isInitiate).toBe(true);
	});

	it('FactoryTimeline.addMilestone with duplicate id', () => {
		expect(() => {
			timeline = FactoryTimeline.addMilestone(timeline, new Milestone(1, 'label 1', date1, true));
		}).toThrow(DuplicateEntityException);
	});
});

describe('test FactoryTimeline.purge', () => {
	let timeline = new Timeline('key', 'title');
	timeline.showAll = true;
	const timelinePurged = new Timeline('key', 'title');
	timelinePurged.showAll = true;

	const date: string = '2020-01-01';

	timeline.tasks.push(new Task(1, 'label 1', date, date, true, 100, true, 'Swimline 1'));
	timeline.milestones.push(new Milestone(1, 'label 1', date, true));
	timeline.isInitiate = true;
	timeline.maxId = 99;

	timeline = FactoryTimeline.purge(timeline);

	it('FactoryTimeline.purge with complete timeline', () => {
		expect(timeline.showAll).toEqual(timelinePurged.showAll);
		expect(timeline).toEqual(timelinePurged);
	});
});

describe('FactoryTimeline.getStartAndEnd', () => {
	// Sample dataset: Mix of visible and hidden entities
	const visibleTask = new Task(1, 'Visible Task', '2023-05-10', '2023-05-20', true, 50, true, '');
	const hiddenTask = new Task(2, 'Hidden Task', '2000-01-01', '2040-01-01', true, 0, false, '');

	const visibleMilestone = new Milestone(3, 'Visible Milestone', '2023-05-25', true);
	const hiddenMilestone = new Milestone(4, 'Hidden Milestone', '1995-06-15', false);

	describe('1. Visibility filtering (showAll)', () => {
		it('should only account for visible entities when showAll is false', () => {
			const tasks = [visibleTask, hiddenTask];
			const milestones = [visibleMilestone, hiddenMilestone];

			// Min visible date: 2023-05-10 (visibleTask)
			// Max visible date: 2023-05-25 (visibleMilestone)
			const { start, end } = FactoryTimeline.getStartAndEnd(
				tasks,
				milestones,
				false,
				DIFF.isBetween1MonthAnd5Months
			);

			// DIFF.isBetween1MonthAnd5Months subtracts 5 days from start and adds 5 days to end
			expect(start).toEqual(new Date('2023-05-05')); // min was 2023-05-10
			expect(end).toEqual(new Date('2023-05-30')); // max was 2023-05-25
		});

		it('should account for all entities including hidden ones when showAll is true', () => {
			const tasks = [visibleTask, hiddenTask];
			const milestones = [visibleMilestone, hiddenMilestone];

			// Min date overall: 1995-06-15 (hiddenMilestone)
			// Max date overall: 2040-01-01 (hiddenTask)
			const { start, end } = FactoryTimeline.getStartAndEnd(
				tasks,
				milestones,
				true,
				DIFF.isMoreThan20Years
			);

			// Year calculation: year - 1 and year + 1, set date to 1
			expect(start).toEqual(new Date('1994-06-01')); // min was 1995-06-15
			expect(end).toEqual(new Date('2041-01-01')); // max was 2040-01-01
		});

		it('should fallback to system date when tasks and milestones lists are empty', () => {
			const today = new Date();
			const { start, end } = FactoryTimeline.getStartAndEnd([], [], false, DIFF.isBelow1Month);

			// DIFF.isBelow1Month subtracts 2 days from start and adds 2 days to end
			const expectedStart = new Date(today);
			expectedStart.setDate(today.getDate() - 2);

			const expectedEnd = new Date(today);
			expectedEnd.setDate(today.getDate() + 2);

			expect(start.getDate()).toBe(expectedStart.getDate());
			expect(end.getDate()).toBe(expectedEnd.getDate());
		});
	});

	describe('2. Differentials: Year-level (isMoreThan20Years, isBetween10YearsAnd20Years)', () => {
		it('should shift start by -1 year and end by +1 year and set day to 1', () => {
			const tasks = [new Task(1, 'Task', '2010-04-12', '2020-09-18', true, 0, true, '')];

			const { start, end } = FactoryTimeline.getStartAndEnd(
				tasks,
				[],
				true,
				DIFF.isBetween10YearsAnd20Years
			);

			expect(start).toEqual(new Date('2009-04-01')); // 2009-04-01
			expect(end).toEqual(new Date('2021-09-01')); // 2020-09-18
		});
	});

	describe('3. Differentials: Month-level thresholds (Day < 15 vs Day >= 15)', () => {
		it('should decrement month if start day < 15 and increment month by 2 if end day > 15', () => {
			// Start day = 10 (< 15), End day = 20 (> 15)
			const tasks = [new Task(1, 'Task', '2023-05-10', '2023-05-20', true, 0, true, '')];

			const { start, end } = FactoryTimeline.getStartAndEnd(
				tasks,
				[],
				true,
				DIFF.isBetween5MonthsAnd20Months
			);

			// Start: May (month 4) -> April (month 3), day set to 1
			expect(start).toEqual(new Date('2023-04-01')); // 2023-05-10
			// End: May (month 4) + 2 months -> July (month 6), day set to 1
			expect(end).toEqual(new Date('2023-07-01')); // 2023-05-20
		});

		it('should keep start month if start day >= 15 and increment end month by 1 if end day <= 15', () => {
			// Start day = 18 (>= 15), End day = 12 (<= 15)
			const tasks = [new Task(1, 'Task', '2023-05-18', '2023-08-12', true, 0, true, '')];

			const { start, end } = FactoryTimeline.getStartAndEnd(
				tasks,
				[],
				true,
				DIFF.isBetween3YearsAnd6Years
			);

			// Start: May (month 4) unchanged, day set to 1
			expect(start).toEqual(new Date('2023-05-01')); // 2023-05-18
			// End: August (month 7) + 1 month -> September (month 8), day set to 1
			expect(end).toEqual(new Date('2023-09-01')); // 2023-08-12
		});
	});

	describe('4. Differentials: Day-level (isBetween1MonthAnd5Months, isBelow1Month)', () => {
		it('should apply +- 5 days for isBetween1MonthAnd5Months', () => {
			const tasks = [new Task(1, 'Task', '2023-05-10', '2023-05-20', true, 0, true, '')];

			const { start, end } = FactoryTimeline.getStartAndEnd(
				tasks,
				[],
				true,
				DIFF.isBetween1MonthAnd5Months
			);

			// +- 5 days
			expect(start).toEqual(new Date('2023-05-05')); // 2023-05-10
			expect(end).toEqual(new Date('2023-05-25')); // 2023-05-20
		});

		it('should apply +- 2 days for isBelow1Month', () => {
			const tasks = [new Task(1, 'Task', '2023-05-10', '2023-05-20', true, 0, true, '')];

			const { start, end } = FactoryTimeline.getStartAndEnd(
				tasks,
				[],
				true,
				DIFF.isBelow1Month
			);

			// +- 2 days
			expect(start).toEqual(new Date('2023-05-08')); // 2023-05-10
			expect(end).toEqual(new Date('2023-05-22')); // 2023-05-20
		});
	});
});

describe('test FactoryTimeline.initiate', () => {

	it('Helpers.initiate', () => {

		const timeline = FactoryTimeline.initiate(new Timeline())

		expect(timeline.tasks.length).toEqual(18);
		expect(timeline.milestones.length).toEqual(4);
		expect(timeline.swimlines.length).toEqual(8);

		expect(timeline.maxId).toEqual(18+4);
		expect(timeline.isInitiate).toEqual(true);
		expect(timeline.isOnline).toEqual(false);
		expect(timeline.key).toStrictEqual('dummy');
		expect(timeline.ownerKey).toStrictEqual(null);
		expect(timeline.writeKey).toStrictEqual(null);
		expect(timeline.readKey).toStrictEqual(null);
		expect(timeline.showAll).toEqual(false);
		expect(timeline.title).toStrictEqual('dummy');

	});
	
});