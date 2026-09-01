import { Rights } from '$lib/rights.class';
import { describe, it, expect } from 'vitest';


describe('Rights', () => {
	it('should initialize owner key from string parameter', () => {
		const rights = new Rights('owner-key-123');

		expect(rights.o).toBe('owner-key-123');
		expect(rights.w).toBeNull();
		expect(rights.r).toBeNull();
		expect(rights.isOwner()).toBe(true);
		expect(rights.hasOwner()).toBe(true);
	});

	it('should parse URLSearchParams and enforce priority rules (reader overrides writer/owner)', () => {
		const params = new URLSearchParams('o=ownerKey&w=writeKey&r=readKey');
		const rights = new Rights(params);

		// Reader flag 'r' resets 'w' and 'o'
		expect(rights.r).toBe('readKey');
		expect(rights.w).toBeNull();
		expect(rights.o).toBeNull();
		expect(rights.isReader()).toBe(true);
		expect(rights.getTimelineField()).toBe('readKey');
		expect(rights.getSlugParamKeyName()).toBe('r');
		expect(rights.getSlugParamKeyValue()).toBe('readKey');
	});

	it('should parse URLSearchParams for writer role', () => {
		const params = new URLSearchParams('o=ownerKey&w=writeKey');
		const rights = new Rights(params);

		expect(rights.w).toBe('writeKey');
		expect(rights.o).toBeNull();
		expect(rights.isWriter()).toBe(true);
		expect(rights.hasWriter()).toBe(true);
		expect(rights.getTimelineField()).toBe('writeKey');
	});

	it('should identify empty rights state', () => {
		const rights = new Rights(null);

		expect(rights.isNone()).toBe(true);
		expect(rights.hasReader()).toBe(false);
		expect(rights.getTimelineField()).toBeNull();
	});
});