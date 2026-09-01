import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appState, syncLocalStorage } from '$lib/state/appState.svelte'; // Adjust path if needed
import { CustomLocalStorage } from '$lib/customLocalStorage';
import { volatileAppState } from '$lib/state/volatileAppState.svelte';
import { LOCAL_STORAGE } from '$lib/constantes';
import { Timeline, Card } from '$lib/struct.class.svelte';

// Mock SvelteKit environment guard for localStorage operations
vi.mock('$app/environment', () => ({
	browser: true
}));

describe('AppState and syncLocalStorage()', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset appState properties to clean values before each test
		appState.currentTimeline = new Timeline();
		appState.cards = [];
		volatileAppState.lastUpdatedLocally = 0;
	});

	describe('appState initialization', () => {
		it('should initialize with default Timeline and empty cards list', () => {
			expect(appState.currentTimeline).toBeDefined();
			expect(appState.currentTimeline.isInitiate).toBe(false);
			expect(Array.isArray(appState.cards)).toBe(true);
			expect(appState.rights).toBeDefined();
		});
	});

	describe('syncLocalStorage()', () => {
		it('should only persist cards and update timestamp when timeline is NOT initiated', () => {
			const saveSpy = vi.spyOn(CustomLocalStorage, 'save').mockImplementation(() => {});
			appState.currentTimeline.isInitiate = false;
			appState.cards = [new Card('card-1', 'Card 1')];

			const beforeTime = Date.now();
			syncLocalStorage();
			const afterTime = Date.now();

			// 1. Verify timeline was NOT saved
			expect(saveSpy).not.toHaveBeenCalledWith(
				appState.currentTimeline.key,
				appState.currentTimeline
			);

			// 2. Verify cards WERE saved
			expect(saveSpy).toHaveBeenCalledTimes(1);
			expect(saveSpy).toHaveBeenCalledWith(LOCAL_STORAGE.KEY_CARDS, appState.cards);

			// 3. Verify volatile state timestamp was updated
			expect(volatileAppState.lastUpdatedLocally).toBeGreaterThanOrEqual(beforeTime);
			expect(volatileAppState.lastUpdatedLocally).toBeLessThanOrEqual(afterTime);
		});

		it('should persist both currentTimeline and cards when currentTimeline is initiated', () => {
			const saveSpy = vi.spyOn(CustomLocalStorage, 'save').mockImplementation(() => {});

			// Setup an initiated timeline
			const timeline = new Timeline('timeline-key-123', 'My Timeline');
			timeline.isInitiate = true;
			appState.currentTimeline = timeline;
			appState.cards = [new Card('card-1', 'Card 1')];

			syncLocalStorage();

			// 1. Verify timeline AND cards were saved
			expect(saveSpy).toHaveBeenCalledTimes(2);

			expect(saveSpy).toHaveBeenNthCalledWith(
				1,
				'timeline-key-123',
				appState.currentTimeline
			);

			expect(saveSpy).toHaveBeenNthCalledWith(
				2,
				LOCAL_STORAGE.KEY_CARDS,
				appState.cards
			);

			// 2. Verify volatile state timestamp update
			expect(volatileAppState.lastUpdatedLocally).toBeGreaterThan(0);
		});
	});
});