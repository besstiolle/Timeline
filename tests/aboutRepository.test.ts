import { describe, expect, it, vi, beforeEach } from 'vitest';

import { get } from '$lib/aboutRepository';



describe('test aboutRepository.get', () => {
    beforeEach(() => {
		vi.restoreAllMocks();
	});
	
	it(' should call the endpoint /api/about with right headers and return Json value', async () => {
		const mockPayload = { foo: 'bar', author: 'Besstiolle' };

		// Mock of global fetch API
		const fetchMock = vi.fn().mockResolvedValue({
			ok: true,
			json: async () => mockPayload
		});
		vi.stubGlobal('fetch', fetchMock);

		const result = await get();

		// Assert that the right enpoint was called with the right headers / method
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(fetchMock).toHaveBeenCalledWith('/api/about', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		// Assert that the right value was returned
		expect(result).toEqual(mockPayload);
	});
});