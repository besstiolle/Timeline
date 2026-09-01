import { describe, it, expect } from 'vitest';

import { Milestone, Timeline } from '$lib/struct.class.svelte';
import { MilestoneViewModel } from '$lib/viewModels/milestoneViewModel';

describe('MilestoneViewModel', () => {
const timeline = new Timeline('t1', 'Timeline');
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

