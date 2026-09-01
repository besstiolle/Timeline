import { describe, it, expect } from 'vitest';

import { Milestone, Task, Timeline } from '$lib/struct.class.svelte';
import { MilestoneViewModel, TaskViewModel } from '$lib/viewModel';

describe('MilestoneViewModels & TaskViewModel', () => {
	const timeline = new Timeline('t1', 'Timeline');
	timeline.tasks = [new Task(1, 'Task 1', '2023-01-01', '2023-01-10', true, 40, true, 'Dev')];

	describe('MilestoneViewModel', () => {
		it('should expose computed milestone getters and xPosition', () => {
			const milestone = new Milestone(1, 'M1', '2023-01-05', true);
			const vm = new MilestoneViewModel(milestone, timeline);

			expect(vm.id).toBe(1);
			expect(vm.label).toBe('M1');
			expect(vm.isShow).toBe(true);
			expect(vm.dateTime).toBe((new Date('2023-01-05').getTime()));
			expect(vm.dateDDMM).toBe('5-Jan.');
			expect(typeof vm.xPosition).toBe('number');
		});
	});

	describe('TaskViewModel', () => {
		const task = timeline.tasks[0];

		it('should compute grabbing states', () => {
			const vmNotGrabbed = new TaskViewModel(task, timeline, null);
			expect(vmNotGrabbed.isGrabbable).toBe(true);
			expect(vmNotGrabbed.isGrabbed).toBe(false);

			const vmGrabbed = new TaskViewModel(task, timeline, 1);
			expect(vmGrabbed.isGrabbed).toBe(true);
		});

		it('should calculate task dimensions and progression width', () => {
			const vm = new TaskViewModel(task, timeline, null);

			expect(vm.leftGrayXPosition).toBeLessThan(vm.rightGrayXPosition);
			expect(vm.grayWidth).toBeGreaterThan(0);
			expect(vm.progressWidth).toBe((40 * vm.grayWidth) / 100);
		});

		it('should return blue fill/stroke colors for incomplete tasks with progress', () => {
			const vm = new TaskViewModel(task, timeline, null);

			expect(vm.fillColor).toBe('#2980B9'); // Blue
			expect(vm.strokeColor).toBe('#236B99');
		});

		it('should return green fill/stroke colors for completed tasks', () => {
			const completedTask = new Task(2, 'T2', '2023-01-01', '2023-01-05', true, 100, true, '');
			const vm = new TaskViewModel(completedTask, timeline, null);

			expect(vm.fillColor).toBe('#16A085'); // Green
		});

		it('should return volatile value', () => {
			const task1 = new Task(2, 'T2', '2023-01-01', '2023-01-05', true, 100, true, '');
			const task2 = new Task(2, 'T2', '2023-01-01', '2023-01-05', true, 100, false, 'label');
			const task3 = new Task(2, 'T2', '2025-01-01', '2025-01-05', true, 49, false, 'label');
			const vm1 = new TaskViewModel(task1, timeline, null);
			const vm2 = new TaskViewModel(task2, timeline, null);
			const vm3 = new TaskViewModel(task3, timeline, null);

			expect(vm1.percentTextAnchor).toBe('end');
			expect(vm1.percentXPosition).toBeGreaterThan(0);
			expect(vm1.labelRight).toBe('1 Jan. - 5 Jan.');
			expect(vm1.hasSwimline).toBe(false);

			expect(vm2.percentTextAnchor).toBe('end');
			expect(vm2.percentXPosition).toBeGreaterThan(0);
			expect(vm2.hasSwimline).toBe(true);
			
			expect(vm3.percentTextAnchor).toBe('start');
			expect(vm3.percentXPosition).toBeGreaterThan(0);
			expect(vm3.hasSwimline).toBe(true);

			expect(vm1.percentXPosition).toBe(vm2.percentXPosition)
			expect(vm3.percentXPosition).toBeGreaterThan(vm2.percentXPosition);
		});
	});
});
