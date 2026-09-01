import { describe, it, expect, beforeEach } from 'vitest';
import { appState } from '$lib/state/appState.svelte';
import { Task, Timeline } from '$lib/struct.class.svelte';
import { displayableSwimlines, displayableTasks } from '$lib/components/SwimAndTasks/SwimAndTasks';

describe('displayableTasksAndSwimlines', () => {
	beforeEach(() => {
		appState.currentTimeline = new Timeline();
	});

	describe('displayableTasks()', () => {
		it('should return only visible tasks when showAll is false', () => {
			const t1 = new Task(1, 'T1', '2023-01-01', '2023-01-02', true, 0, true, '');
			const t2 = new Task(2, 'T2', '2023-01-01', '2023-01-02', true, 0, false, ''); // Hidden
			appState.currentTimeline.tasks = [t1, t2];
			appState.currentTimeline.showAll = false;

			const result = displayableTasks();

			expect(result).toHaveLength(1);
			expect(result[0]).toBe(t1);
		});

		it('should return all tasks when showAll is true', () => {
			const t1 = new Task(1, 'T1', '2023-01-01', '2023-01-02', true, 0, true, '');
			const t2 = new Task(2, 'T2', '2023-01-01', '2023-01-02', true, 0, false, '');
			appState.currentTimeline.tasks = [t1, t2];
			appState.currentTimeline.showAll = true;

			const result = displayableTasks();

			expect(result).toHaveLength(2);
		});
	});

	describe('displayableSwimlines()', () => {
		it('should construct swimline layout map for tasks grouped by swimline name', () => {
			const t1 = new Task(1, 'T1', '2023-01-01', '2023-01-02', true, 0, true, 'Dev');
			const t2 = new Task(2, 'T2', '2023-01-01', '2023-01-02', true, 0, true, 'Dev');
			appState.currentTimeline.tasks = [t1, t2];
			appState.currentTimeline.showAll = true;

			const swimlineMap = displayableSwimlines();

			expect(swimlineMap.has(1)).toBe(true);
			const entry = swimlineMap.get(1);
			expect(entry?.swimline.label).toBe('Dev');
			expect(entry?.position).toBe(0);
			expect(entry?.height).toBeGreaterThan(0);
		});
	});
});