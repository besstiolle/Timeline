import { describe, expect, it, vi } from 'vitest';
import { FactoryTask } from '$lib/factoryTask';
import { NotFoundException } from '$lib/timelineException.class';
import { Task, Timeline } from '$lib/struct.class.svelte';

//Mock console.error() to avoid vi console pollution
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('test factoryCards.join', () => {
	const task: Task = new Task(1, 'label', '2020-01-01', '2020-01-02', true, 99, true, 'Swim1');
	const result: string = 'task;label;true;2020-01-01;2020-01-02;true;99;Swim1';
	it('FactoryTask.join with nominal values', () => {
		expect(FactoryTask.join(task, ';')).toBe(result);
	});
});

describe('test FactoryTask.getById', () => {
	const task1 = new Task(
		1,
		'label 1',
		'2022-01-01',
		'2022-02-01',
		true,
		100,
		true,
		'Swimline 1'
	);
	const task2 = new Task(
		2,
		'label 2',
		'2022-01-01',
		'2022-02-01',
		true,
		100,
		true,
		'Swimline 1'
	);
	const task3 = new Task(
		3,
		'label 3',
		'2022-01-01',
		'2022-02-01',
		true,
		100,
		true,
		'Swimline 1'
	);
	const task4 = new Task(
		4,
		'label 4',
		'2022-01-01',
		'2022-02-01',
		true,
		100,
		true,
		'Swimline 1'
	);

	const timeline = new Timeline('key', 'title');
	timeline.tasks.push(task1);
	timeline.tasks.push(task2);
	timeline.tasks.push(task3);
	timeline.tasks.push(task4);

	it('FactoryTask.getById with nominal values', () => {
		expect(FactoryTask.getById(timeline, 2)).toBe(task2);
	});

	it('FactoryTask.getById with unknow values', () => {
		expect(() => {
			FactoryTask.getById(timeline, 10);
		}).toThrow(NotFoundException);
	});
});


describe('FactoryTask.updateById ', () => {
	const task1 = new Task(
		1,
		'label 1',
		'2022-01-01',
		'2022-02-01',
		true,
		100,
		true,
		'Swimline 1'
	);
	const task2 = new Task(
		2,
		'label 2',
		'2022-01-01',
		'2022-02-01',
		true,
		100,
		true,
		'Swimline 1'
	);
	const task2b = new Task(
		2,
		'label 2b',
		'2022-01-01',
		'2022-02-01',
		true,
		100,
		true,
		'Swimline 1'
	);
	const task3 = new Task(
		3,
		'label 3',
		'2022-01-01',
		'2022-02-01',
		true,
		100,
		true,
		'Swimline 1'
	);
	const task4 = new Task(
		4,
		'label 4',
		'2022-01-01',
		'2022-02-01',
		true,
		100,
		true,
		'Swimline 1'
	);
	const task10 = new Task(
		10,
		'label 10',
		'2022-01-01',
		'2022-02-01',
		true,
		100,
		true,
		'Swimline 1'
	);

	let timeline = new Timeline('key', 'title');
	timeline.tasks.push(task1);
	timeline.tasks.push(task2);
	timeline.tasks.push(task3);
	timeline.tasks.push(task4);

	it('FactoryTask.getById with nominal values', () => {
		timeline = FactoryTask.updateById(timeline, task2b);
		expect(FactoryTask.getById(timeline, 2)).toBe(task2b);
	});

	it('FactoryTask.getById with unknow values', () => {
		expect(() => {
			FactoryTask.updateById(timeline, task10);
		}).toThrow(NotFoundException);
	});
});


describe('FactoryTask.duplicate', () => {
	const task1 = new Task(
		1,
		'label 1',
		'2022-01-01',
		'2022-02-01',
		true,
		100,
		true,
		'Swimline 1'
	);
	const task2 = FactoryTask.duplicate(task1);

	it('FactoryTask.duplicate and check memory pointer', () => {
		expect(task1).not.toBe(task2);
		expect(task1).toStrictEqual(task2);
	});
});

describe('FactoryTask.getSimilarTasksWithSameSwimline', () => {
	const task1 = new Task(
		1,
		'label 1',
		'',
		'',
		true,
		100,
		true,
		'Swimline 1'
	);
	const task2 = new Task(
		2,
		'label 2',
		'',
		'',
		true,
		100,
		true,
		'Swimline 1'
	);
	const task3 = new Task(
		3,
		'label 3',
		'',
		'',
		true,
		100,
		true,
		'Swimline 2'
	);
	const task4 = new Task(
		4,
		'label 4',
		'',
		'',
		true,
		100,
		true,
		'Swimline 1'
	);
	const task_other = new Task(
		5,
		'label 5',
		'',
		'',
		true,
		100,
		true,
		'Swimline 1'
	);

	const listTasks:Task[] = []
	listTasks.push(task1)
	listTasks.push(task2)
	listTasks.push(task3)
	listTasks.push(task4)

	it('FactoryTask.getSimilarTasksWithSameSwimline and no valid swmiline', () => {
		const result = FactoryTask.getSimilarTasksWithSameSwimline(task_other, listTasks)
		expect(result.length).toBe(0);
	});
	it('FactoryTask.getSimilarTasksWithSameSwimline and unique swmiline', () => {
		const result = FactoryTask.getSimilarTasksWithSameSwimline(task3, listTasks)
		expect(result.length).toBe(1);
		expect(result[0].label).toBe(task3.label);
	});
	it('FactoryTask.getSimilarTasksWithSameSwimline and first dispatched swmiline', () => {
		const result = FactoryTask.getSimilarTasksWithSameSwimline(task1, listTasks)
		expect(result.length).toBe(2);
		expect(result[0].label).toBe(task1.label);
		expect(result[1].label).toBe(task2.label);
	});
	it('FactoryTask.getSimilarTasksWithSameSwimline and first dispatched swmiline', () => {
		const result = FactoryTask.getSimilarTasksWithSameSwimline(task4, listTasks)
		expect(result.length).toBe(1);
		expect(result[0].label).toBe(task4.label);
	});
});