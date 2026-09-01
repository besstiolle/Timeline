import { describe, it, expect } from 'vitest';
import { Timeline, type abstractTimelineInterface } from '$lib/struct.class.svelte';
import { parseAbstractTimeline } from '$lib/components/Upload/Upload';

describe('parseAbstractTimeline()', () => {
	it('should parse title, tasks, and milestones into Timeline instance', () => {
		const initialTimeline = new Timeline();
		const abstractData: abstractTimelineInterface = {
			title: 'Parsed Timeline',
			version: '1.0',
			tasks: [
				{
					label: 'Task 1',
					start: '2023-01-01',
					end: '2023-01-10',
					progress: 50,
					hasProgress: true,
					isShow: true,
					swimline: 'Dev'
				}
			],
			milestones: [
				{
					label: 'Milestone 1',
					date: '2023-01-15',
					isShow: true
				}
			]
		};

		const result = parseAbstractTimeline(initialTimeline, abstractData);

		expect(result.title).toBe('Parsed Timeline');
		expect(result.tasks).toHaveLength(1);
		expect(result.tasks[0].label).toBe('Task 1');
		expect(result.tasks[0].progress).toBe(50);
		expect(result.milestones).toHaveLength(1);
		expect(result.milestones[0].label).toBe('Milestone 1');
	});

	it('should set default boolean flags for tasks and milestones if omitted or false', () => {
		const initialTimeline = new Timeline();
		const abstractData: abstractTimelineInterface = {
			title: 'Defaults Check',
			version: '1.0',
			tasks: [
				{
					label: 'Task Default',
					start: '2023-01-01',
					end: '2023-01-05',
					progress: 0,
					hasProgress: false,
					isShow: false,
					swimline: ''
				}
			],
			milestones: [
				{
					label: 'Milestone Default',
					date: '2023-01-05',
					isShow: false
				}
			]
		};

		const result = parseAbstractTimeline(initialTimeline, abstractData);

		expect(result.tasks[0].hasProgress).toBe(false);
		expect(result.tasks[0].isShow).toBe(false);
		expect(result.milestones[0].isShow).toBe(false);
	});
});