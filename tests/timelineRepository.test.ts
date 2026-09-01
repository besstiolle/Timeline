import { describe, it, expect, vi, beforeEach } from 'vitest';

import { NotFoundOnlineException } from '$lib/timelineException.class';
import type { Timeline } from '$lib/struct.class.svelte';
import { create, get, remove } from '$lib/timelineRepository';

//Mock console.error() to avoid vi console pollution
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('timelineRepository', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	describe('create()', () => {
		it('should throw an error if neither ownerKey nor writeKey is provided', async () => {
			const invalidTimeline = { title: 'Test' } as Timeline;

			// Should fail validation before calling fetch
			await expect(create(invalidTimeline)).rejects.toThrow(
				'at least you must provide one of theses : ownerKey or writeKey in timeline object'
			);
		});

		it('should send a POST request with the serialized timeline and return JSON', async () => {
			const mockTimeline = {
				title: 'Test Timeline',
				ownerKey: 'owner-123'
			} as Timeline;
			const mockResponse = { success: true, id: 'timeline-1' };

			// Mock successful POST fetch response
			const fetchMock = vi.fn().mockResolvedValue({
				ok: true,
				json: async () => mockResponse
			});
			vi.stubGlobal('fetch', fetchMock);

			const result = await create(mockTimeline);

			// Assertions for endpoint, method, headers, and body
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock).toHaveBeenCalledWith('/api/timeline', {
				method: 'POST',
				body: JSON.stringify(mockTimeline),
				headers: {
					'content-type': 'application/json'
				}
			});
			expect(result).toEqual(mockResponse);
		});
	});

	describe('get()', () => {
		it('should extract the key, construct the query string, and return JSON', async () => {
			const mockResponse = { title: 'Retrieved Timeline' };
			const params = new URLSearchParams('key=my-key&readOnly=true');

			// Mock successful GET fetch response
			const fetchMock = vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				json: async () => mockResponse
			});
			vi.stubGlobal('fetch', fetchMock);

			const result = await get(params);

			// Verify key was removed from params and formatted correctly in URL
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock).toHaveBeenCalledWith('/api/timeline/my-key?readOnly=true', {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
			});
			expect(result).toEqual(mockResponse);
		});

		it('should throw NotFoundOnlineException when status is 404', async () => {
			const params = new URLSearchParams('key=missing-key');

			// Mock 404 GET response
			const fetchMock = vi.fn().mockResolvedValue({
				ok: false,
				status: 404
			});
			vi.stubGlobal('fetch', fetchMock);
			vi.spyOn(console, 'error').mockImplementation(() => {});

			await expect(get(params)).rejects.toThrow(NotFoundOnlineException);
		});
	});

	describe('remove()', () => {
		it('should send a DELETE request and return response text', async () => {
			const mockResponseText = 'Deleted successfully';
			const params = new URLSearchParams('key=delete-key&force=true');

			// Mock successful DELETE fetch response
			const fetchMock = vi.fn().mockResolvedValue({
				ok: true,
				status: 200,
				text: async () => mockResponseText
			});
			vi.stubGlobal('fetch', fetchMock);

			const result = await remove(params);

			// Verify request endpoint URL and DELETE method
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(fetchMock).toHaveBeenCalledWith('/api/timeline/delete-key?force=true', {
				method: 'DELETE',
				headers: {
					'content-type': 'application/json'
				}
			});
			expect(result).toBe(mockResponseText);
		});

		it('should throw NotFoundOnlineException when status is 404', async () => {
			const params = new URLSearchParams('key=non-existent-key');

			// Mock 404 DELETE response
			const fetchMock = vi.fn().mockResolvedValue({
				ok: false,
				status: 404
			});
			vi.stubGlobal('fetch', fetchMock);
			vi.spyOn(console, 'error').mockImplementation(() => {});

			await expect(remove(params)).rejects.toThrow(NotFoundOnlineException);
		});
	});
});