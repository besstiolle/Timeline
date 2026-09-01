import { describe, it, expect } from 'vitest';
import { TaskValidator } from '$lib/taskValidator'; 

describe('TaskValidator', () => {
    
    it('should reject invalid parameter', () => {
        expect(TaskValidator.isValidDateString('2023-01-10')).toBe(true);
        expect(TaskValidator.isValidDateString('2023-01-99')).toBe(false);
        expect(TaskValidator.isValidDateString('string')).toBe(false);
        expect(TaskValidator.isValidDateString('')).toBe(false);
        // @ts-expect-error Testing invalid runtime input
        expect(TaskValidator.isValidDateString(null)).toBe(false);
    });
    
    it('should validate start and end date ordering via isStartDateValid / isEndDateValid', () => {
        expect(TaskValidator.isStartDateValid('2023-01-01', '2023-01-10')).toBe(true);
        expect(TaskValidator.isStartDateValid('2023-01-10', '2023-01-01')).toBe(false);
        // @ts-expect-error Testing invalid runtime input
        expect(TaskValidator.isStartDateValid(null, '2023-01-01')).toBe(false);
        // @ts-expect-error Testing invalid runtime input
        expect(TaskValidator.isStartDateValid('2023-01-10', null)).toBe(true);

        expect(TaskValidator.isEndDateValid('2023-01-01', '2023-01-10')).toBe(true);
        expect(TaskValidator.isEndDateValid('2023-01-10', '2023-01-01')).toBe(false);
        // @ts-expect-error Testing invalid runtime input
        expect(TaskValidator.isEndDateValid('2023-01-10', null)).toBe(false);
        // @ts-expect-error Testing invalid runtime input
        expect(TaskValidator.isEndDateValid(null, '2023-01-01')).toBe(true);
    });

    it('should clamp progression integer values within 0-100 range', () => {
        expect(TaskValidator.getValideProgression(50)).toBe(50);
        expect(TaskValidator.getValideProgression(150)).toBe(100);
        expect(TaskValidator.getValideProgression(-10)).toBe(-10);
        // Non-integer or invalid input fallback
        // @ts-expect-error Testing invalid runtime input
        expect(TaskValidator.getValideProgression('50')).toBe(0);
        expect(TaskValidator.getValideProgression(12.5)).toBe(0);
    });
});