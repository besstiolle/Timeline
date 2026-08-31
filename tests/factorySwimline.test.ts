import { describe, expect, it } from 'vitest';
import { FactorySwimline } from '$lib/factorySwimline';
import { Task } from '$lib/struct.class.svelte';

describe('FactorySwimline.countVisibleTasksInListForSwimlineName', () => {
	let tasks = []
	tasks.push(new Task(1,'task#1','','',true,100,true,'A'))
	tasks.push(new Task(2,'task#2','','',true,100,true,'A'))
	tasks.push(new Task(3,'task#3','','',true,100,true,'B'))
	tasks.push(new Task(4,'task#4','','',true,100,false,'B'))
	tasks.push(new Task(5,'task#5','','',true,100,true,'B'))
	tasks.push(new Task(6,'task#6','','',true,100,false,'A'))
	tasks.push(new Task(7,'task#7','','',true,100,false,'C'))

	it('Test Swimline A', () => {
		expect(FactorySwimline.countVisibleTasksInListForSwimlineName(
				tasks,'A')).toBe(2)
	});
	it('Test Swimline B', () => {
		expect(FactorySwimline.countVisibleTasksInListForSwimlineName(
				tasks,'B')).toBe(2)
	});
	it('Test Swimline C', () => {
		expect(FactorySwimline.countVisibleTasksInListForSwimlineName(
				tasks,'C')).toBe(0)
	});
});

describe('FactorySwimline.hasVisibleTasksInListForSwimlineName', () => {
	let tasks = []
	tasks.push(new Task(1,'task#1','','',true,100,true,'A'))
	tasks.push(new Task(2,'task#2','','',true,100,true,'A'))
	tasks.push(new Task(3,'task#3','','',true,100,true,'B'))
	tasks.push(new Task(4,'task#4','','',true,100,false,'B'))
	tasks.push(new Task(5,'task#5','','',true,100,true,'B'))
	tasks.push(new Task(6,'task#6','','',true,100,false,'A'))
	tasks.push(new Task(7,'task#7','','',true,100,false,'C'))

	it('Test Swimline A', () => {
		expect(FactorySwimline.hasVisibleTasksInListForSwimlineName(
				tasks,'A')).toBe(true)
	});
	it('Test Swimline B', () => {
		expect(FactorySwimline.hasVisibleTasksInListForSwimlineName(
				tasks,'B')).toBe(true)
	});
	it('Test Swimline C', () => {
		expect(FactorySwimline.hasVisibleTasksInListForSwimlineName(
				tasks,'C')).toBe(false)
	});
});
