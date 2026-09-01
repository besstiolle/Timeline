import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Card, Timeline, Task, Milestone, Swimline } from '$lib/struct.class.svelte';
import { GRID } from '$lib/constantes';

describe('struct.class.svelte domain models', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	describe('Card', () => {
		it('should initialize with provided parameters and set default values', () => {
			const card = new Card('c1', 'Card Title');

			expect(card.key).toBe('c1');
			expect(card.title).toBe('Card Title');
			expect(card.lastUpdated).toBeInstanceOf(Date);
			expect(card.isOnline).toBe(false);
		});

		it('should serialize correctly via toJSON()', () => {
			const card = new Card('c1', 'Card Title');
			const json = card.toJSON();

			expect(json).toEqual({
				key: 'c1',
				title: 'Card Title',
				lastUpdated: card.lastUpdated,
				isOnline: false
			});
		});

		it('should create an independent clone', () => {
			const original = new Card('c1', 'Card Title');
			original.isOnline = true;

			const cloned = original.clone();

			expect(cloned).not.toBe(original);
			expect(cloned.key).toBe(original.key);
			expect(cloned.title).toBe(original.title);
			expect(cloned.isOnline).toBe(true);
			expect(cloned.lastUpdated).toEqual(original.lastUpdated);
		});
	});

	describe('Task', () => {
		it('should parse start and end dates correctly', () => {
			const task = new Task(1, 'Task 1', '2023-01-10', '2023-01-20', true, 50, true, 'Dev');

			expect(task.getStart()).toEqual(new Date('2023-01-10'));
			expect(task.getEnd()).toEqual(new Date('2023-01-20'));
		});

		it('should update start and end dates formatted as YYYY-MM-DD', () => {
			const task = new Task(1, 'Task 1', '2023-01-10', '2023-01-20', true, 50, true, 'Dev');

			task.setStart(new Date('2023-02-15'));
			task.setEnd(new Date('2023-02-28'));

			expect(task.dateStart).toBe('2023-02-15');
			expect(task.dateEnd).toBe('2023-02-28');
		});

		it('should serialize via toJSON() and clone independently', () => {
			const task = new Task(1, 'Task 1', '2023-01-10', '2023-01-20', true, 50, true, 'Dev');
			
			expect(task.toJSON()).toEqual({
				id: 1,
				label: 'Task 1',
				dateStart: '2023-01-10',
				dateEnd: '2023-01-20',
				hasProgress: true,
				progress: 50,
				isShow: true,
				swimline: 'Dev'
			});

			const cloned = task.clone();
			expect(cloned).not.toBe(task);
			expect(cloned).toEqual(task);
		});
	});

	describe('Milestone', () => {
		it('should parse and update milestone date', () => {
			const milestone = new Milestone(1, 'Release', '2023-06-01', true);

			expect(milestone.getDate()).toEqual(new Date('2023-06-01'));

			milestone.setDate(new Date('2023-07-01'));
			expect(milestone.date).toBe('2023-07-01');
		});

		it('should serialize via toJSON() and clone independently', () => {
			const milestone = new Milestone(1, 'Release', '2023-06-01', true);

			expect(milestone.toJSON()).toEqual({
				id: 1,
				label: 'Release',
				date: '2023-06-01',
				isShow: true
			});

			const cloned = milestone.clone();
			expect(cloned).not.toBe(milestone);
			expect(cloned).toEqual(milestone);
		});
	});

	describe('Swimline', () => {
		it('should calculate countAllTasks based on tasksIndex array length', () => {
			const swimline = new Swimline(0, 'Backend');
			swimline.tasksIndex = [0, 1, 2];

			expect(swimline.countAllTasks).toBe(3);
		});
	});

	describe('Timeline', () => {
		it('should generate sequential IDs via getNextId()', () => {
			const timeline = new Timeline('t1', 'Timeline 1');

			expect(timeline.getNextId()).toBe(1);
			expect(timeline.getNextId()).toBe(2);
			expect(timeline.maxId).toBe(2);
		});

		it('should manage focus dates correctly', () => {
			const timeline = new Timeline();

			expect(timeline.getStartFocus()).toBeNull();
			expect(timeline.getEndFocus()).toBeNull();

			timeline.setStartFocus(new Date('2023-03-01'));
			timeline.setEndFocus(new Date('2023-03-31'));

			expect(timeline.dateStartFocus).toBe('2023-03-01');
			expect(timeline.dateEndFocus).toBe('2023-03-31');
			expect(timeline.getStartFocus()).toEqual(new Date('2023-03-01'));
			expect(timeline.getEndFocus()).toEqual(new Date('2023-03-31'));
		});

		it('should compute viewbox according to task list visibility', () => {
			const timeline = new Timeline();
			timeline.tasks = [
				new Task(1, 'T1', '2023-01-01', '2023-01-02', false, 0, true, ''),
				new Task(2, 'T2', '2023-01-01', '2023-01-02', false, 0, false, '')
			];

			// showAll = false (1 visible task)
			timeline.showAll = false;
			const viewboxHidden = timeline.viewbox;

			// showAll = true (2 total tasks)
			timeline.showAll = true;
			const viewboxAll = timeline.viewbox;

			expect(viewboxHidden).toContain(`0 0 ${GRID.ALL_WIDTH} `);
			expect(viewboxAll).toContain(`0 0 ${GRID.ALL_WIDTH} `);
			expect(viewboxHidden).not.toEqual(viewboxAll);
		});

		it('should group tasks with non-empty swimline labels into Swimline objects', () => {
			const timeline = new Timeline();
			timeline.tasks = [
				new Task(10, 'T1', '2023-01-01', '2023-01-02', false, 0, true, 'Dev'),
				new Task(11, 'T2', '2023-01-01', '2023-01-02', false, 0, true, 'Dev'),
				new Task(12, 'T3', '2023-01-01', '2023-01-02', false, 0, true, ''), // No swimline
				new Task(13, 'T4', '2023-01-01', '2023-01-02', false, 0, true, 'QA')
			];

			const swimlines = timeline.swimlines;

			expect(swimlines).toHaveLength(2);
			expect(swimlines[0].label).toBe('Dev');
			expect(swimlines[0].tasksIds).toEqual([10, 11]);
			expect(swimlines[0].tasksIndex).toEqual([0, 1]);

			expect(swimlines[1].label).toBe('QA');
			expect(swimlines[1].tasksIds).toEqual([13]);
			expect(swimlines[1].tasksIndex).toEqual([3]);
		});

		it('should clone timeline and deep-copy task/milestone arrays', () => {
			const timeline = new Timeline('key1', 'Title 1');
			timeline.tasks = [new Task(1, 'T1', '2023-01-01', '2023-01-02', false, 0, true, '')];
			timeline.milestones = [new Milestone(2, 'M1', '2023-01-01', true)];

			const cloned = timeline.clone();

			expect(cloned).not.toBe(timeline);
			expect(cloned.tasks).not.toBe(timeline.tasks);
			expect(cloned.milestones).not.toBe(timeline.milestones);
			expect(cloned.tasks).toHaveLength(1);
			expect(cloned.milestones).toHaveLength(1);
		});

		it('should log a warning when calling read-only setters', () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			const timeline = new Timeline();

			timeline.swimlines = [];
			timeline.start = '2023-01-01';
			timeline.end = '2023-01-01';
			timeline.viewbox = '0 0 100 100';
			timeline.differencial = 10;

			expect(consoleSpy).toHaveBeenCalledTimes(5);
		});
	});
});