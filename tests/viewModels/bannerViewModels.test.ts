import { describe, it, expect } from 'vitest';
import { DIFF } from '$lib/constantes';
import { BannerViewModel } from '$lib/viewModels/bannerViewModel';

describe('getJalons()', () => {

	it('should generate yearly jalons when differencial is isMoreThan20Years', () => {

		const bannerVM = new BannerViewModel(new Date('1990-01-01'), new Date('2020-01-01'), DIFF.isMoreThan20Years)
		const milestonesVM = bannerVM.jalonsVM;

		expect(milestonesVM.length).toBeGreaterThan(5);
		expect(milestonesVM[0].left).toBeDefined();
		expect(milestonesVM[0].label).toBeDefined();
		expect(milestonesVM[0].classCss).toBeDefined();

		expect(milestonesVM[4].left).toBeGreaterThan(0);
	});

	it('should apply "newYear" CSS class for january/first days depending on differential', () => {
		
		const bannerVM = new BannerViewModel(new Date('2023-01-01'), new Date('2023-06-01'), DIFF.isBetween5MonthsAnd20Months)
		const milestonesVM = bannerVM.jalonsVM;

		const hasNewYearClass = milestonesVM.some((j) => j.classCss === 'newYear');

		expect(hasNewYearClass).toBe(true);
	});
});