import { describe, it, expect } from 'vitest';
import { MilestoneValidator } from '$lib/milestoneValidator'; 

describe('MilestoneValidator.isValidDateString()', () => {
	it('should return false for empty or invalid date strings', () => {
		expect(MilestoneValidator.isValidDateString('')).toBe(false);
		expect(MilestoneValidator.isValidDateString('invalid-date')).toBe(false);
	});

	it('should return true for dates within 40 years of current year', () => {
		const currentYear = new Date().getFullYear();
		expect(MilestoneValidator.isValidDateString(`${currentYear}-05-10`)).toBe(true);
	});

	it('should return false for dates exceeding 40 years deviation', () => {
		expect(MilestoneValidator.isValidDateString('1900-01-01')).toBe(false);
	});
});
