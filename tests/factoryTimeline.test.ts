import { describe, expect, it, vi } from 'vitest';

import { FactoryTimeline } from '$lib/factoryTimeline';
import { DuplicateEntityException } from '$lib/timelineException.class';
import { Milestone, Swimline, Task, Timeline } from '$lib/struct.class.svelte';
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
	let timelinePurged = new Timeline('key', 'title');
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
/* 
describe('test FactoryTimeline.refresh with differents dates', () => {
	let timeline1 = new Timeline('key', 'title');
	timeline1.tasks.push(
		new Task(1, 'label 1', '2020-01-01', '2020-01-31', true, 100, true, 'Swimline 1')
	);

	timeline1 = FactoryTimeline.refresh(timeline1);
	it('FactoryTimeline._processLimites with dates < 1 month', () => {
		expect(timeline1.start).toEqual('2019-12-30');
		expect(timeline1.end).toEqual('2020-02-02');
	});

	let timeline2 = new Timeline('key', 'title');
	timeline2.tasks.push(
		new Task(1, 'label 1', '2020-01-15', '2020-03-01', true, 100, true, 'Swimline 1')
	);

	timeline2 = FactoryTimeline.refresh(timeline2);
	it('FactoryTimeline._processLimites with dates 1 month => 5 months ', () => {
		expect(timeline2.start).toEqual('2020-01-10');
		expect(timeline2.end).toEqual('2020-03-06');
	});

	let timeline3a = new Timeline('key', 'title');
	timeline3a.tasks.push(
		new Task(1, 'label 1', '2020-02-07', '2022-02-07', true, 100, true, 'Swimline 1')
	);

	timeline3a = FactoryTimeline.refresh(timeline3a);
	it('FactoryTimeline._processLimites with dates 5 months => 10 years + day of month < 15', () => {
		expect(timeline3a.start).toEqual('2020-01-01');
		expect(timeline3a.end).toEqual('2022-03-01');
	});

	let timeline3b = new Timeline('key', 'title');
	timeline3b.tasks.push(
		new Task(1, 'label 1', '2020-02-17', '2022-02-17', true, 100, true, 'Swimline 1')
	);

	timeline3b = FactoryTimeline.refresh(timeline3b);
	it('FactoryTimeline._processLimites with dates 5 months => 10 years + day of month > 15', () => {
		expect(timeline3b.start).toEqual('2020-02-01');
		expect(timeline3b.end).toEqual('2022-04-01');
	});

	let timeline4 = new Timeline('key', 'title');
	timeline4.tasks.push(
		new Task(1, 'label 1', '2020-01-15', '2040-02-01', true, 100, true, 'Swimline 1')
	);

	timeline4 = FactoryTimeline.refresh(timeline4);
	it('FactoryTimeline._processLimites with dates 10 years => +', () => {
		expect(timeline4.start).toEqual('2019-01-01');
		expect(timeline4.end).toEqual('2041-02-01');
	});
}); */
/* 
describe('test FactoryTimeline.refresh with show/add & viewbox', () => {
	const date1: string = '2020-01-01';
	const taskVisible = new Task(1, 'label 1', date1, date1, true, 100, true, 'Swimline 1');
	const taskHidden = new Task(1, 'label 1', date1, date1, true, 100, false, 'Swimline 1');
	let timeline1 = new Timeline('key', 'title');
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
	timeline1 = FactoryTimeline.refresh(timeline1);

	it('FactoryTimeline.testProcessViewboxResizing without showall', () => {
		expect(timeline1.viewbox).toBe('0 0 1000 265');
	});

	let timeline2 = new Timeline('key', 'title');
	timeline2.showAll = true;
	timeline2 = FactoryTimeline.refresh(timeline2);

	it('FactoryTimeline.testProcessViewboxResizing with showall & no task', () => {
		expect(timeline2.viewbox).toBe('0 0 1000 115');
	});

	let timeline3 = new Timeline('key', 'title');
	timeline3.showAll = true;
	timeline3.tasks.push(taskVisible);
	timeline3.tasks.push(taskVisible);
	timeline3.tasks.push(taskHidden);
	timeline3.tasks.push(taskHidden);

	timeline3 = FactoryTimeline.refresh(timeline3);

	it('FactoryTimeline.testProcessViewboxResizing with showall & various task', () => {
		expect(timeline3.viewbox).toBe('0 0 1000 235');
	});
}); */
/* 
describe('test FactoryTimeline.refresh with swimline', () => {
	let timeline1 = new Timeline('key', 'title');
	const date1: string = '2020-01-01';
	timeline1.tasks.push(new Task(1, 'label 1', date1, date1, true, 100, true, 'Swimline 1', 0));
	timeline1.tasks.push(new Task(2, 'label 2', date1, date1, true, 100, false, 'Swimline 2', 0));
	timeline1.tasks.push(new Task(3, 'label 3', date1, date1, true, 100, false, 'Swimline 2', 0));
	timeline1.tasks.push(new Task(4, 'label 4', date1, date1, true, 100, false, 'Swimline 1', 0));

	let timeline2 = new Timeline('key', 'title');
	timeline2.tasks.push(new Task(1, 'label 1', date1, date1, true, 100, true, '', -1));
	timeline2.tasks.push(new Task(2, 'label 2', date1, date1, true, 100, true, '', -1));
	timeline2.tasks.push(new Task(3, 'label 3', date1, date1, true, 100, false, '', -1));
	timeline2.tasks.push(new Task(4, 'label 4', date1, date1, true, 100, false, '', -1));

	timeline1 = FactoryTimeline.refresh(timeline1);

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

	timeline2 = FactoryTimeline.refresh(timeline2);

	it('FactoryTimeline._refreshSwimlines with no swimline', () => {
		expect(timeline2.swimlines.length).toBe(0);
	});
}); */
describe('test FactoryTimeline.getStartAndEnd', () => {

	it('Helpers.getStartAndEnd with differencial isMoreThan20Years and with show all', () => {
		const today = new Date()
		const tasks = []
		const milestones = []

		tasks.push(new Task(1, 'label 1', '1980-01-15', '2000-01-15', true, 100, false, ''));

		milestones.push(new Milestone(1, 'label 1', '2020-02-16', false));


		const timeline = new Timeline()
		timeline.tasks = tasks
		timeline.milestones = milestones
		let min1 = FactoryTimeline.getMin(tasks, milestones, true);
		let min2 = FactoryTimeline.getMin(tasks, milestones, false);

		expect(min1).toStrictEqual(new Date('1980-01-15'))
		expect(min2).toStrictEqual(today)

		let max1 = FactoryTimeline.getMax(tasks, milestones, true);
		let max2 = FactoryTimeline.getMax(tasks, milestones, false);

		expect(max1).toStrictEqual(new Date('2020-02-16'))
		expect(max2.getFullYear()).toStrictEqual(today.getFullYear())
		expect(max2.getMonth()).toStrictEqual(today.getMonth())
		expect(max2.getDate()).toStrictEqual(today.getDate())

		let {start,end} = FactoryTimeline.getStartAndEnd(tasks, milestones, true, DIFF.isMoreThan20Years)

		expect(start).toStrictEqual(new Date('1979-01-01'));
		expect(end).toStrictEqual(new Date('2021-02-01'));

	});
	it('Helpers.getStartAndEnd with differencial isMoreThan20Years and without show all', () => {
		let today = new Date()
		const tasks = []
		const milestones = []

		tasks.push(new Task(1, 'label 1', '1980-01-15', '2000-01-15', true, 100, false, ''));

		milestones.push(new Milestone(1, 'label 1', '2020-02-16', false));

		let {start,end} = FactoryTimeline.getStartAndEnd(tasks, milestones, false, DIFF.isMoreThan20Years)

		//Attendu : (Année-1)-mois-01 et (Année+1)-mois-01 
		
		expect(start.getTime()).toBeLessThan(today.getTime());
		expect(end.getTime()).toBeGreaterThan(today.getTime());

	});
});

//TODO : faire les cas des autre DIFF

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