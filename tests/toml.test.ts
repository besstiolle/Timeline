import { describe, it, expect } from 'vitest';
import { timelineToObject, goToml } from '$lib/toml';
import { Timeline, Task, Milestone } from '$lib/struct.class.svelte';

describe('TOML Exporter', () => {
	it('should transform Timeline instance into plain object via timelineToObject()', () => {
		const timeline = new Timeline('t1', 'My Timeline');
		timeline.tasks = [new Task(1, 'Task 1', '2023-01-01', '2023-01-05', true, 50, true, 'Dev')];
		timeline.milestones = [new Milestone(2, 'Release', '2023-01-10', true)];

		const result = timelineToObject(timeline) as { title: string; tasks: unknown[] };

		expect(result.title).toBe('My Timeline');
		expect(result.tasks).toHaveLength(1);
	});

	it('should serialize JavaScript object into TOML string format', () => {
		const obj = {
			title: 'Test',
			count: 5,
			active: true,
			items: ['a', 'b'],
			dat: new Date('2000-01-01'),
			obj: {foo:"bar"},
			objs: [{foo:"bar"},{foo:"bar2"}],
			null:null
		};

		const tomlOutput = goToml(obj);

		expect(tomlOutput).toContain('title = "Test"');
		expect(tomlOutput).toContain('count = 5');
		expect(tomlOutput).toContain('active = true');
		expect(tomlOutput).toContain('items = [ "a" , "b" ]');
		expect(tomlOutput).toContain('dat = "2000-01-01T00:00:00.000Z"');
		expect(tomlOutput).toContain(`[obj]\r\nfoo = "bar"`);
		expect(tomlOutput).toContain(`[[objs]]\r\nfoo = "bar"\r\n\r\n[[objs]]\r\nfoo = "bar2"`);
	}); 

	it('should throw an error when non-object is passed to goToml()', () => {
		// @ts-expect-error Testing invalid input
		expect(() => goToml('string')).toThrow();
	});
});