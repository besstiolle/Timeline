import { describe, it, expect, beforeEach } from 'vitest';
import { appState } from '$lib/state/appState.svelte';
import { Timeline, Task } from '$lib/struct.class.svelte';
import { getJalons } from '$lib/components/Banner/Banner';

describe('getJalons()', () => {
	beforeEach(() => {
		appState.currentTimeline = new Timeline('t1', 'Timeline');
	});

	it('should generate yearly jalons when differencial is isMoreThan20Years', () => {
		appState.currentTimeline.tasks = [
			new Task(1, 'Task', '1990-01-01', '2020-01-01', false, 0, true, '')
		];

		const jalons = getJalons();

		expect(jalons.length).toBeGreaterThan(0);
		expect(jalons[0]).toHaveProperty('left');
		expect(jalons[0]).toHaveProperty('label');
		expect(jalons[0]).toHaveProperty('classCss');
	});

	it('should apply "newYear" CSS class for january/first days depending on differential', () => {
		appState.currentTimeline.tasks = [
			new Task(1, 'Task', '2023-01-01', '2023-06-01', false, 0, true, '')
		];

		const jalons = getJalons();
		const hasNewYearClass = jalons.some((j) => j.classCss === 'newYear');

		expect(hasNewYearClass).toBe(true);
	});
});