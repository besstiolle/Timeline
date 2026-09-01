import { describe, it, expect, vi, beforeEach } from 'vitest';

import { get } from '$lib/aboutRepository';
import type { Version } from '$lib/struct.class.svelte';
import { getCurrentVersion, getDistantVersion, toLiteralString, toVersion, versionCompare } from '$lib/components/Version/Version';
import type { ResponseWithMeta } from '$lib/types';

vi.mock('$lib/aboutRepository', () => ({
	get: vi.fn()
}));

describe('versionService', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	describe('getDistantVersion()', () => {
		it('should fetch remote JSON version successfully', async () => {
			const mockData = { main: { latest: '1.0.0', commit: 'abc' } };
			vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
				ok: true,
				json: async () => mockData
			}));

			const result = await getDistantVersion();

			expect(result).toEqual(mockData);
		});

		it('should throw an error on failed HTTP response', async () => {
			vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
				ok: false,
				status: 404
			}));

			await expect(getDistantVersion()).rejects.toThrow('HTTP error 404');
		});
	});

	describe('getCurrentVersion()', () => {
		it('should call get() from aboutRepository', async () => {
			const mockAbout:ResponseWithMeta = 
                {
                    meta: {
                        ts: 1,
                        duration: 1 //duration of execution on the server side in milliseconds
                    },
                    data: { version: '2.0.0' }
                }
            
            ;
			vi.mocked(get).mockResolvedValue(mockAbout);

			const result = await getCurrentVersion();

			expect(get).toHaveBeenCalledTimes(1);
			expect(result).toEqual(mockAbout);
		});
	});

	describe('toString()', () => {
		it('should format Version object into x.y.z string', () => {
			const v: Version = { x: 1, y: 2, z: 3 };

			expect(toLiteralString(v)).toBe('1.2.3');
		});
	});

	describe('versionCompare()', () => {
		it('should correctly compare semver objects (x, y, and z precedence)', () => {
			expect(versionCompare({ x: 2, y: 0, z: 0 }, { x: 1, y: 9, z: 9 })).toBe(1);
			expect(versionCompare({ x: 1, y: 0, z: 0 }, { x: 2, y: 0, z: 0 })).toBe(-1);

			expect(versionCompare({ x: 1, y: 2, z: 0 }, { x: 1, y: 1, z: 9 })).toBe(1);
			expect(versionCompare({ x: 1, y: 1, z: 0 }, { x: 1, y: 2, z: 0 })).toBe(-1);

			expect(versionCompare({ x: 1, y: 1, z: 2 }, { x: 1, y: 1, z: 1 })).toBe(1);
			expect(versionCompare({ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 2 })).toBe(-1);

			expect(versionCompare({ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 })).toBe(0);
		});
	});

	describe('toVersion()', () => {
		it('should parse valid semver string into a Version object', () => {
			expect(toVersion('1.4.12')).toEqual({ x: 1, y: 4, z: 12 });
			expect(toVersion('v2.0.1')).toEqual({ x: 2, y: 0, z: 1 });
		});

		it('should log warning and fallback to 0.0.0 when format is invalid', () => {
			const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			const result = toVersion('invalid-version');

			expect(result).toEqual({ x: 0, y: 0, z: 0 });
			expect(consoleSpy).toHaveBeenCalledWith(
				"versionParam wasn't in the expected format : ",
				'invalid-version'
			);
		});
	});
});