import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toString, toVersion, versionCompare } from '$lib/components/Version/Version';

beforeEach(() => {
	//Mock console.error() to avoid vi console pollution
	vi.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('test toVersion & toString', () => {
	it('Test toVersion => toString mapping', () => {
		expect(toVersion('0.0.0')).toStrictEqual({ x: 0, y: 0, z: 0 });
		expect(toVersion('1.2.3')).toStrictEqual({ x: 1, y: 2, z: 3 });
		expect(toVersion('01.02.03')).toStrictEqual({ x: 1, y: 2, z: 3 });
		expect(toVersion('01a.02.03')).toStrictEqual({ x: 0, y: 0, z: 0 });
		expect(toVersion('01.0a2.03')).toStrictEqual({ x: 0, y: 0, z: 0 });
		expect(toVersion('01.02.a03')).toStrictEqual({ x: 0, y: 0, z: 0 });

		expect(toVersion('v0.0.0')).toStrictEqual({ x: 0, y: 0, z: 0 });
		expect(toVersion('V1.2.3')).toStrictEqual({ x: 1, y: 2, z: 3 });
		expect(toVersion('v01.02.03')).toStrictEqual({ x: 1, y: 2, z: 3 });
		expect(toVersion('V01a.02.03')).toStrictEqual({ x: 0, y: 0, z: 0 });
		expect(toVersion('v01.0a2.03')).toStrictEqual({ x: 0, y: 0, z: 0 });
		expect(toVersion('V01.02.a03')).toStrictEqual({ x: 0, y: 0, z: 0 });
	});

	it('Test toString => toVersion mapping', () => {
		expect(toString({ x: 0, y: 0, z: 0 })).toBe('0.0.0');
		expect(toString({ x: 1, y: 2, z: 3 })).toBe('1.2.3');
		expect(toString({ x: 100, y: 2, z: 3 })).toBe('100.2.3');
	});
});

it('Test toString => toVersion mapping', () => {
	expect(versionCompare({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 })).toBe(0);

	expect(versionCompare({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 })).toBe(-1);
	expect(versionCompare({ x: 9, y: 99, z: 99 }, { x: 10, y: 0, z: 0 })).toBe(-1);
	expect(versionCompare({ x: 0, y: 9, z: 0 }, { x: 1, y: 99, z: 0 })).toBe(-1);

	expect(versionCompare({ x: 10, y: 0, z: 0 }, { x: 1, y: 99, z: 99 })).toBe(1);
});
