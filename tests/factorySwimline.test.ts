import { describe, expect, it } from 'vitest';
import { FactorySwimline } from '$lib/factorySwimline';
import { Timeline } from '$lib/struct.class';

describe('FactorySwimline.create', () => {
	let timeline = new Timeline('key', 'title');
	timeline = FactorySwimline.create(timeline, 'swimline1');
	timeline = FactorySwimline.create(timeline, 'swimline2');
	const index2 = timeline.swimlines.length - 1;
	timeline = FactorySwimline.create(timeline, 'swimline3');

	it('FactorySwimline.create with nominal values', () => {
		expect(index2).toBe(1);
		expect(timeline.swimlines.length).toBe(3);
		expect(timeline.swimlines[index2].label).toBe('swimline2');
	});
});
