import { describe, it, expect, vi } from 'vitest';
import { Timeline } from '$lib/struct.class.svelte';
import { CREDENTIALS_NOT_EQUALS_ProblemJsonResponse } from '$lib/api/problemJson';
import { accessControl } from '$lib/server/keyValidator';

//Mock console.error() to avoid vi console pollution
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('accessControl()', () => {
	const instance = '/api/timeline/test';

	it('should return null when all provided keys match the timeline instance', () => {
		const timeline = new Timeline('t1', 'Title');
		timeline.ownerKey = 'owner-123';
		timeline.writeKey = 'write-456';
		timeline.readKey = 'read-789';

		const result = accessControl(instance, timeline, 'owner-123', 'write-456', 'read-789');

		expect(result).toBeNull();
	});

	it('should return null when non-matching keys are passed as null', () => {
		const timeline = new Timeline('t1', 'Title');
		timeline.ownerKey = 'owner-123';

		const result = accessControl(instance, timeline, null, null, null);

		expect(result).toBeNull();
	});

	it('should return CREDENTIALS_NOT_EQUALS response when ownerKey mismatches', () => {
		const timeline = new Timeline('t1', 'Title');
		timeline.ownerKey = 'owner-correct';

		const result = accessControl(instance, timeline, 'owner-wrong', null, null);

		expect(result).toBeInstanceOf(CREDENTIALS_NOT_EQUALS_ProblemJsonResponse);
	});

	it('should return CREDENTIALS_NOT_EQUALS response when writeKey mismatches', () => {
		const timeline = new Timeline('t1', 'Title');
		timeline.writeKey = 'write-correct';

		const result = accessControl(instance, timeline, null, 'write-wrong', null);

		expect(result).toBeInstanceOf(CREDENTIALS_NOT_EQUALS_ProblemJsonResponse);
	});

	it('should return CREDENTIALS_NOT_EQUALS response when readKey mismatches', () => {
		const timeline = new Timeline('t1', 'Title');
		timeline.readKey = 'read-correct';

		const result = accessControl(instance, timeline, null, null, 'read-wrong');

		expect(result).toBeInstanceOf(CREDENTIALS_NOT_EQUALS_ProblemJsonResponse);
	});
});