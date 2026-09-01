import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CustomLocalStorage } from '$lib/customLocalStorage';
import { LOCAL_STORAGE } from '$lib/constantes';
import { JsonParser } from '$lib/jsonParser';
import type { Card, Timeline } from '$lib/struct.class.svelte';

// Mock SvelteKit environment guard
vi.mock('$app/environment', () => ({
	browser: true
}));

// Mock JsonParser revivers to isolate unit tests
vi.mock('$lib/jsonParser', () => ({
	JsonParser: {
		cardsReviver: vi.fn((_key, value) => value),
		timelineReviver: vi.fn((_key, value) => value)
	}
}));

describe('test CustomLocalStorage', () => {
	beforeEach(() => {
		localStorage.clear();
		vi.clearAllMocks();
	});

	describe('save()', () => {
		it('should serialize and store string value in localStorage', () => {
			CustomLocalStorage.save('test-key', 'test-value');

			expect(localStorage.getItem('test-key')).toBe(JSON.stringify('test-value'));
		});

		it('should serialize complex objects using optional replacer', () => {
			const cardsMock = [{ key: 'c1', title: 'Card 1' }] as Array<Card>;
			const replacer = vi.fn((_k, v) => v);

			CustomLocalStorage.save(LOCAL_STORAGE.KEY_CARDS, cardsMock, replacer);

			expect(localStorage.getItem(LOCAL_STORAGE.KEY_CARDS)).toBe(JSON.stringify(cardsMock));
			expect(replacer).toHaveBeenCalled();
		});
	});

	describe('get() and getters', () => {
		it('should return null when key does not exist in localStorage', () => {
			const result = CustomLocalStorage.getTimeline('non-existent-key');

			expect(result).toBeNull();
		});

		it('should retrieve timeline and invoke timelineReviver', () => {
			const timelineMock = { key: 't1', title: 'My Timeline' } as Timeline;
			localStorage.setItem('t1', JSON.stringify(timelineMock));

			const result = CustomLocalStorage.getTimeline('t1');

			expect(result).toEqual(timelineMock);
			expect(JsonParser.timelineReviver).toHaveBeenCalled();
		});

		it('should retrieve cards and invoke cardsReviver', () => {
			const cardsMock = [{ key: 'c1' }] as Array<Card>;
			localStorage.setItem(LOCAL_STORAGE.KEY_CARDS, JSON.stringify(cardsMock));

			const result = CustomLocalStorage.getCards();

			expect(result).toEqual(cardsMock);
			expect(JsonParser.cardsReviver).toHaveBeenCalled();
		});

		it('should retrieve picto using full prefixed key', () => {
			const pictoKey = 'icon-star';
			const fullKey = LOCAL_STORAGE.KEY_PICTO + pictoKey;
			localStorage.setItem(fullKey, JSON.stringify('svg-data'));

			const result = CustomLocalStorage.getPicto(pictoKey);

			expect(result).toBe('svg-data');
		});
	});

	describe('remove() and clear()', () => {
		it('should remove specific key from localStorage', () => {
			localStorage.setItem('key-to-delete', JSON.stringify('data'));

			CustomLocalStorage.remove('key-to-delete');

			expect(localStorage.getItem('key-to-delete')).toBeNull();
		});

		it('should clear all entries from localStorage', () => {
			localStorage.setItem('k1', JSON.stringify('v1'));
			localStorage.setItem('k2', JSON.stringify('v2'));

			CustomLocalStorage.clear();

			expect(localStorage.length).toBe(0);
		});
	});
});