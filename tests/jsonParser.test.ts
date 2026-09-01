import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JsonParser } from '$lib/jsonParser';
import { JsonParserException } from '$lib/timelineException.class';

//Mock console.error() to avoid vi console pollution
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('JsonParser - Fallback and Exception branches', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	describe('timelineReviver()', () => {
		it('should return value directly when key is a numeric index (array/map item)', () => {
			const itemValue = { unknownProp: 'someValue' };
			
			// Keys matching /^\d+$/ like "0", "1", "42"
			const resultIndex0 = JsonParser.timelineReviver('0', itemValue);
			const resultIndex42 = JsonParser.timelineReviver('42', itemValue);

			expect(resultIndex0).toBe(itemValue);
			expect(resultIndex42).toBe(itemValue);
		});

		it('should log info and return null when an unknown key has a null value', () => {
			const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
			const unknownKey = 'unknownOrLegacyProperty';

			const result = JsonParser.timelineReviver(unknownKey, null);

			expect(result).toBeNull();
			expect(consoleSpy).toHaveBeenCalledTimes(1);
			expect(consoleSpy).toHaveBeenCalledWith(
				'value was null for key `%o` in JsonReviver.timelineReviver() function',
				unknownKey
			);
		});

		it('should throw JsonParserException when an unexpected non-null key/value pair is encountered', () => {
			const invalidKey = 'unrecognizedKey';
			const invalidValue = 'unrecognizedValue';

			expect(() => {
				JsonParser.timelineReviver(invalidKey, invalidValue);
			}).toThrow(JsonParserException);

			// Verify exception details
			try {
				JsonParser.timelineReviver(invalidKey, invalidValue);
			} catch (err) {
				expect(err).toBeInstanceOf(JsonParserException);
				const exception = err as JsonParserException;
				expect(exception.message).toContain(invalidKey);
			}
		});
	});

	describe('cardsReviver()', () => {
		it('should return value directly when key is a numeric index (array item)', () => {
			const itemValue = { customField: 123 };

			const resultIndex0 = JsonParser.cardsReviver('0', itemValue);
			const resultIndex99 = JsonParser.cardsReviver('99', itemValue);

			expect(resultIndex0).toBe(itemValue);
			expect(resultIndex99).toBe(itemValue);
		});

		it('should log info and return null when an unknown key has a null value', () => {
			const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
			const unknownKey = 'unexpectedNullField';

			const result = JsonParser.cardsReviver(unknownKey, null);

			expect(result).toBeNull();
			expect(consoleSpy).toHaveBeenCalledTimes(1);
			expect(consoleSpy).toHaveBeenCalledWith(
				'value was null for key `%o` in JsonReviver.cardsReviver() function',
				unknownKey
			);
		});

		it('should throw JsonParserException when an unexpected non-null key/value pair is encountered', () => {
			const invalidKey = 'corruptedField';
			const invalidValue = 9999;

			expect(() => {
				JsonParser.cardsReviver(invalidKey, invalidValue);
			}).toThrow(JsonParserException);

			// Verify exception details
			try {
				JsonParser.cardsReviver(invalidKey, invalidValue);
			} catch (err) {
				expect(err).toBeInstanceOf(JsonParserException);
				const exception = err as JsonParserException;
				expect(exception.message).toContain(invalidKey);
			}
		});
	});
});