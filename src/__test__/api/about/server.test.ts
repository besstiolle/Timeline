import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RequestEventStub, toRequestEvent } from '../apiUtils';
import { createTestDb } from '../dbUtilsTest';
import { truncateTimeline } from '$lib/server/timelineCRUD';

const ENTRYPOINT = 'https://dummyEntrypoint.io/api/about';
const HEADER_ACCESS_CONTROL_ALLOW_METHOD = 'Access-Control-Allow-Methods';
const HEADER_CONTENT_TYPE_APPPBJSON = 'application/problem+json';
const HEADER_ALLOW = 'allow';

//Mock db before importing
vi.mock('$lib/server/db', async () => {
	return { db: await createTestDb() };
});
import * as handlers from '../../../routes/api/about/+server';
import { db } from '$lib/server/db';

beforeEach(async () => {
	//truncate tables in db
	//See also alternative solution : DrizzleSeed reset https://orm.drizzle.team/docs/seed-overview#reset-database
	truncateTimeline(db);

	//Mock console.error() to avoid vi console pollution
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

const HEADER_CONTENT_TYPE = 'Content-Type';
const HEADER_CONTENT_TYPE_APPJSON = 'application/json';

describe('API /api/about with OPTIONS & denied method', () => {
	it('OPTIONS should return 204', async () => {
		const event = new RequestEventStub('OPTIONS', ENTRYPOINT, null, db);
		const response = await handlers.OPTIONS(toRequestEvent(event));

		expect(response.status).toBe(204);
		expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);

		expect(response.headers.get(HEADER_ACCESS_CONTROL_ALLOW_METHOD)).toBe('GET, OPTIONS');
		expect(response.headers.get(HEADER_ALLOW)).toBe('GET, OPTIONS');

		const text = await response.text();
		expect(text).toBe('');
	});

	it('fallback should return 405', async () => {
		const event = new RequestEventStub('POST', ENTRYPOINT, null, db);
		const response = await handlers.fallback(toRequestEvent(event));

		expect(response.status).toBe(405);
		expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

		const json = await response.json();
		expect(json.status).toBe(405);
	});
});

it('GET /api/about should return a ResponseWithMeta JSON ', async () => {
	const event = new RequestEventStub('GET', ENTRYPOINT, null, db);
	const response = await handlers.GET(toRequestEvent(event));

	expect(response.status).toBe(200);
	expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);
	const json = await response.json();
	expect(json.data).not.toBeFalsy();
	expect(json.meta).not.toBeFalsy();
	expect(json.meta.ts).not.toBeFalsy();
	expect(json.meta.duration).greaterThanOrEqual(0);
	expect(json.meta.duration).lessThan(200);

	// Test AboutVersion fields
	expect(json.data.version).not.toBeFalsy();
});
