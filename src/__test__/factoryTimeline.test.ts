import { describe, expect, it, vi } from 'vitest';

import { FactoryTimeline } from '$lib/factoryTimeline';
import { DuplicateEntityException } from '$lib/timelineException.class';
import { Milestone, Swimline, Task, Timeline } from '$lib/struct.class';

vi.mock('$app/environment', () => ({
	default: {
		browser: true
	}
}));

//Mock console.error() to avoid vi console pollution
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('test FactoryTimeline.getMin', () => {
	const timeline1 = new Timeline('key', 'title');
	const timeline2 = new Timeline('key', 'title');

	const date1: string = '2020-01-01';
	const date2: string = '2021-12-31';
	const date3: string = '2019-12-31';
	const date4: string = '2021-02-15';
	const date5: string = '2000-01-00';
	const date6: string = '2018-02-15';

	timeline1.tasks.push(new Task(1, 'label 1', date1, date4, true, 100, true, 'Swimline 1', 5));
	timeline1.tasks.push(new Task(2, 'label 2', date2, date1, true, 100, true, 'Swimline 1', 5));
	timeline1.tasks.push(new Task(3, 'label 3', date3, date2, true, 100, true, 'Swimline 1', 5));
	timeline1.tasks.push(new Task(4, 'label 4', date4, date5, true, 100, true, 'Swimline 1', 5));

	timeline1.milestones.push(new Milestone(1, 'label 1', date2, true));
	timeline1.milestones.push(new Milestone(2, 'label 2', date2, true));
	timeline1.milestones.push(new Milestone(3, 'label 3', date2, true));
	timeline1.milestones.push(new Milestone(4, 'label 4', date2, true));

	it('Helpers.getMin with minimal value in task.end and task.start', () => {
		expect(FactoryTimeline.getMin(timeline1)).toEqual(new Date(date3));
	});

	timeline2.tasks.push(new Task(1, 'label 1', date1, date4, true, 100, true, 'Swimline 1', 5));
	timeline2.tasks.push(new Task(2, 'label 2', date2, date1, true, 100, true, 'Swimline 1', 5));
	timeline2.tasks.push(new Task(3, 'label 3', date3, date2, true, 100, true, 'Swimline 1', 5));
	timeline2.tasks.push(new Task(4, 'label 4', date4, date5, true, 100, true, 'Swimline 1', 5));

	timeline2.milestones.push(new Milestone(1, 'label 1', date2, true));
	timeline2.milestones.push(new Milestone(2, 'label 2', date2, true));
	timeline2.milestones.push(new Milestone(3, 'label 3', date2, true));
	timeline2.milestones.push(new Milestone(4, 'label 4', date2, true));
	timeline2.milestones.push(new Milestone(5, 'label 5', date6, true));

	it('Helpers.getMin with minimal value in milestone', () => {
		expect(FactoryTimeline.getMin(timeline2)).toEqual(new Date(date6));
	});
});

describe('test FactoryTimeline.getMax', () => {
	const timeline1 = new Timeline('key', 'title');
	const timeline2 = new Timeline('key', 'title');

	const date1: string = '2020-01-01';
	const date2: string = '2021-12-31';
	const date3: string = '2019-12-31';
	const date4: string = '2021-02-15';
	const date5: string = '2000-01-00';
	const date6: string = '2030-02-15';

	timeline1.tasks.push(new Task(1, 'label 1', date1, date4, true, 100, true, 'Swimline 1', 5));
	timeline1.tasks.push(new Task(2, 'label 2', date6, date1, true, 100, true, 'Swimline 1', 5));
	timeline1.tasks.push(new Task(3, 'label 3', date3, date2, true, 100, true, 'Swimline 1', 5));
	timeline1.tasks.push(new Task(4, 'label 4', date4, date5, true, 100, true, 'Swimline 1', 5));

	timeline1.milestones.push(new Milestone(1, 'label 1', date4, true));
	timeline1.milestones.push(new Milestone(2, 'label 2', date4, true));
	timeline1.milestones.push(new Milestone(3, 'label 3', date4, true));
	timeline1.milestones.push(new Milestone(4, 'label 4', date4, true));

	it('Helpers.getMax with maximal value in task.end and task.start', () => {
		expect(FactoryTimeline.getMax(timeline1)).toEqual(new Date(date2));
	});

	timeline2.tasks.push(new Task(1, 'label 1', date1, date4, true, 100, true, 'Swimline 1', 5));
	timeline2.tasks.push(new Task(2, 'label 2', date6, date1, true, 100, true, 'Swimline 1', 5));
	timeline2.tasks.push(new Task(3, 'label 3', date3, date4, true, 100, true, 'Swimline 1', 5));
	timeline2.tasks.push(new Task(4, 'label 4', date4, date5, true, 100, true, 'Swimline 1', 5));

	timeline2.milestones.push(new Milestone(1, 'label 1', date4, true));
	timeline2.milestones.push(new Milestone(2, 'label 2', date4, true));
	timeline2.milestones.push(new Milestone(3, 'label 3', date4, true));
	timeline2.milestones.push(new Milestone(4, 'label 4', date4, true));
	timeline2.milestones.push(new Milestone(5, 'label 5', date2, true));

	it('FactoryTimeline.getMax with maximal value in milestone', () => {
		expect(FactoryTimeline.getMax(timeline2)).toEqual(new Date(date2));
	});
});

describe('test FactoryTimeline.addTask', () => {
	const timeline = new Timeline('key', 'title');
	const date1: string = '2020-01-01';
	const date2: string = '2021-12-31';

	FactoryTimeline.addTask(
		timeline,
		new Task(1, 'label 1', date1, date2, true, 100, true, 'Swimline 1', 5)
	);
	FactoryTimeline.addTask(
		timeline,
		new Task(2, 'label 2', date1, date2, true, 100, true, 'Swimline 1', 5)
	);
	FactoryTimeline.addTask(
		timeline,
		new Task(3, 'label 3', date1, date2, true, 100, true, 'Swimline 1', 5)
	);

	it('FactoryTimeline.addTask with nominal value', () => {
		expect(timeline.tasks.length).toBe(3);
		expect(timeline.isInitiate).toBe(true);
	});

	it('FactoryTimeline.addTask with duplicate id', () => {
		expect(() => {
			FactoryTimeline.addTask(
				timeline,
				new Task(3, 'label 3', date1, date2, true, 100, true, 'Swimline 1', 5)
			);
		}).toThrow(DuplicateEntityException);
	});
});

describe('test FactoryTimeline with duplicate creation', () => {
	const timeline = new Timeline('key', 'title');
	const date1: string = '2020-01-01';

	FactoryTimeline.addMilestone(timeline, new Milestone(1, 'label 1', date1, true));
	FactoryTimeline.addMilestone(timeline, new Milestone(2, 'label 2', date1, true));
	FactoryTimeline.addMilestone(timeline, new Milestone(3, 'label 3', date1, true));

	it('FactoryTimeline.addMilestone with nominal value', () => {
		expect(timeline.milestones.length).toBe(3);
		expect(timeline.isInitiate).toBe(true);
	});

	it('FactoryTimeline.addMilestone with duplicate id', () => {
		expect(() => {
			FactoryTimeline.addMilestone(timeline, new Milestone(1, 'label 1', date1, true));
		}).toThrow(DuplicateEntityException);
	});
});

describe('test FactoryTimeline.purge', () => {
	const timeline = new Timeline('key', 'title');
	timeline.showAll = true;
	const timelinePurged = new Timeline('key', 'title');
	timelinePurged.showAll = true;

	const date: string = '2020-01-01';

	timeline.tasks.push(new Task(1, 'label 1', date, date, true, 100, true, 'Swimline 1', 5));
	timeline.milestones.push(new Milestone(1, 'label 1', date, true));
	timeline.swimlines.push(new Swimline('label'));
	timeline.isInitiate = true;
	timeline.end = date;
	timeline.start = date;
	timeline.maxId = 99;
	timeline.viewbox = 'viewbox Value';

	FactoryTimeline.purge(timeline);

	it('FactoryTimeline.purge with complete timeline', () => {
		expect(timeline.showAll).toEqual(timelinePurged.showAll);
		expect(timeline).toEqual(timelinePurged);
	});
});

describe('test FactoryTimeline.refresh with differents dates', () => {
	const timeline1 = new Timeline('key', 'title');
	timeline1.tasks.push(
		new Task(1, 'label 1', '2020-01-01', '2020-01-31', true, 100, true, 'Swimline 1', 5)
	);

	FactoryTimeline.refresh(timeline1);
	it('FactoryTimeline._processLimites with dates < 1 month', () => {
		expect(timeline1.start).toEqual('2019-12-30');
		expect(timeline1.end).toEqual('2020-02-02');
	});

	const timeline2 = new Timeline('key', 'title');
	timeline2.tasks.push(
		new Task(1, 'label 1', '2020-01-15', '2020-03-01', true, 100, true, 'Swimline 1', 5)
	);

	FactoryTimeline.refresh(timeline2);
	it('FactoryTimeline._processLimites with dates 1 month => 5 months ', () => {
		expect(timeline2.start).toEqual('2020-01-10');
		expect(timeline2.end).toEqual('2020-03-06');
	});

	const timeline3a = new Timeline('key', 'title');
	timeline3a.tasks.push(
		new Task(1, 'label 1', '2020-02-07', '2022-02-07', true, 100, true, 'Swimline 1', 5)
	);

	FactoryTimeline.refresh(timeline3a);
	it('FactoryTimeline._processLimites with dates 5 months => 10 years + day of month < 15', () => {
		expect(timeline3a.start).toEqual('2020-01-01');
		expect(timeline3a.end).toEqual('2022-03-01');
	});

	const timeline3b = new Timeline('key', 'title');
	timeline3b.tasks.push(
		new Task(1, 'label 1', '2020-02-17', '2022-02-17', true, 100, true, 'Swimline 1', 5)
	);

	FactoryTimeline.refresh(timeline3b);
	it('FactoryTimeline._processLimites with dates 5 months => 10 years + day of month > 15', () => {
		expect(timeline3b.start).toEqual('2020-02-01');
		expect(timeline3b.end).toEqual('2022-04-01');
	});

	const timeline4 = new Timeline('key', 'title');
	timeline4.tasks.push(
		new Task(1, 'label 1', '2020-01-15', '2040-02-01', true, 100, true, 'Swimline 1', 5)
	);

	FactoryTimeline.refresh(timeline4);
	it('FactoryTimeline._processLimites with dates 10 years => +', () => {
		expect(timeline4.start).toEqual('2019-01-01');
		expect(timeline4.end).toEqual('2041-02-01');
	});
});

describe('test FactoryTimeline.refresh with show/add & viewbox', () => {
	const date1: string = '2020-01-01';
	const taskVisible = new Task(1, 'label 1', date1, date1, true, 100, true, 'Swimline 1', 5);
	const taskHidden = new Task(1, 'label 1', date1, date1, true, 100, false, 'Swimline 1', 5);
	const timeline1 = new Timeline('key', 'title');
	timeline1.showAll = false;
	timeline1.tasks.push(taskVisible);
	timeline1.tasks.push(taskVisible);
	timeline1.tasks.push(taskVisible);
	timeline1.tasks.push(taskVisible);
	timeline1.tasks.push(taskVisible);
	timeline1.tasks.push(taskHidden);
	timeline1.tasks.push(taskHidden);
	timeline1.tasks.push(taskHidden);
	timeline1.tasks.push(taskHidden);
	timeline1.tasks.push(taskHidden);
	FactoryTimeline.refresh(timeline1);

	it('FactoryTimeline.testProcessViewboxResizing without showall', () => {
		expect(timeline1.viewbox).toBe('0 0 1000 265');
	});

	const timeline2 = new Timeline('key', 'title');
	timeline2.showAll = true;
	FactoryTimeline.refresh(timeline2);

	it('FactoryTimeline.testProcessViewboxResizing with showall & no task', () => {
		expect(timeline2.viewbox).toBe('0 0 1000 115');
	});

	const timeline3 = new Timeline('key', 'title');
	timeline3.showAll = true;
	timeline3.tasks.push(taskVisible);
	timeline3.tasks.push(taskVisible);
	timeline3.tasks.push(taskHidden);
	timeline3.tasks.push(taskHidden);

	FactoryTimeline.refresh(timeline3);

	it('FactoryTimeline.testProcessViewboxResizing with showall & various task', () => {
		expect(timeline3.viewbox).toBe('0 0 1000 235');
	});
});

describe('test FactoryTimeline.refresh with swimline', () => {
	const timeline1 = new Timeline('key', 'title');
	const date1: string = '2020-01-01';
	timeline1.tasks.push(new Task(1, 'label 1', date1, date1, true, 100, true, 'Swimline 1', 0));
	timeline1.tasks.push(new Task(2, 'label 2', date1, date1, true, 100, false, 'Swimline 2', 0));
	timeline1.tasks.push(new Task(3, 'label 3', date1, date1, true, 100, false, 'Swimline 2', 0));
	timeline1.tasks.push(new Task(4, 'label 4', date1, date1, true, 100, false, 'Swimline 1', 0));

	const timeline2 = new Timeline('key', 'title');
	timeline2.tasks.push(new Task(1, 'label 1', date1, date1, true, 100, true, '', -1));
	timeline2.tasks.push(new Task(2, 'label 2', date1, date1, true, 100, true, '', -1));
	timeline2.tasks.push(new Task(3, 'label 3', date1, date1, true, 100, false, '', -1));
	timeline2.tasks.push(new Task(4, 'label 4', date1, date1, true, 100, false, '', -1));

	FactoryTimeline.refresh(timeline1);

	it('FactoryTimeline._refreshSwimlines with various swimlines', () => {
		expect(timeline1.swimlines.length).toBe(3);
		expect(timeline1.swimlines[0].label).toBe('Swimline 1');
		expect(timeline1.swimlines[0].countAllTasks).toBe(1);
		expect(timeline1.swimlines[0].countVisibleTasks).toBe(1);
		expect(timeline1.swimlines[0].isShow).toBe(true);
		expect(timeline1.swimlines[1].label).toBe('Swimline 2');
		expect(timeline1.swimlines[1].countAllTasks).toBe(2);
		expect(timeline1.swimlines[1].countVisibleTasks).toBe(0);
		expect(timeline1.swimlines[1].isShow).toBe(false);
		expect(timeline1.swimlines[2].label).toBe('Swimline 1');
		expect(timeline1.swimlines[2].countAllTasks).toBe(1);
		expect(timeline1.swimlines[2].countVisibleTasks).toBe(0);
		expect(timeline1.swimlines[2].isShow).toBe(false);
	});

	FactoryTimeline.refresh(timeline2);

	it('FactoryTimeline._refreshSwimlines with no swimline', () => {
		expect(timeline2.swimlines.length).toBe(0);
	});
});
