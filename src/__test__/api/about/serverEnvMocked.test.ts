import { beforeEach, expect, it, vi } from 'vitest';
import { RequestEventStub, toRequestEvent } from '../apiUtils';
import { truncateTimeline } from '$lib/server/timelineCRUD';
import { createTestDb } from '../dbUtilsTest';

const ENTRYPOINT = 'https://dummyEntrypoint.io/api/about';

//Mock db before importing
vi.mock('$lib/server/db', async () => {
	return { db: await createTestDb() };
});

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

it('GET /api/about should return a ResponseWithMeta JSON with no version if we change ENV VAR to false', async () => {
	vi.doMock('$env/dynamic/private', () => ({
		env: { SHOW_VERSION: 'false' }
	}));
	const { GET } = await import('../../../routes/api/about/+server');

	const { env } = await import('$env/dynamic/private');

	expect(env.SHOW_VERSION).toBe('false');

	const event = new RequestEventStub('GET', ENTRYPOINT, null, db);
	const response = await GET(toRequestEvent(event));

	expect(response.status).toBe(200);
	expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);
	const json = await response.json();
	expect(json.data).not.toBeFalsy();
	expect(json.meta).not.toBeFalsy();
	expect(json.meta.ts).not.toBeFalsy();

	// Test AboutVersion fields
	expect(json.data.version).toBe('');

	vi.resetModules(); // nettoie les effets du mock pour les autres tests
});

it('GET /api/about should return a ResponseWithMeta JSON with no version if we change ENV VAR to undefined', async () => {
	vi.doMock('$env/dynamic/private', () => ({
		env: { SHOW_VERSION: undefined }
	}));
	const { GET } = await import('../../../routes/api/about/+server');

	const { env } = await import('$env/dynamic/private');
	expect(env.SHOW_VERSION).toBe(undefined);

	const event = new RequestEventStub('GET', ENTRYPOINT, null, db);
	const response = await GET(toRequestEvent(event));

	expect(response.status).toBe(200);
	expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);
	const json = await response.json();
	expect(json.data).not.toBeFalsy();
	expect(json.meta).not.toBeFalsy();
	expect(json.meta.ts).not.toBeFalsy();

	// Test AboutVersion fields
	expect(json.data.version).toBe('');

	vi.resetModules(); // nettoie les effets du mock pour les autres tests
});

it('GET /api/about should return a ResponseWithMeta JSON with no version if we change ENV VAR to empty', async () => {
	vi.doMock('$env/dynamic/private', () => ({
		env: {}
	}));
	const { GET } = await import('../../../routes/api/about/+server');

	const { env } = await import('$env/dynamic/private');
	expect(env.SHOW_VERSION).toBe(undefined);

	const event = new RequestEventStub('GET', ENTRYPOINT, null, db);
	const response = await GET(toRequestEvent(event));

	expect(response.status).toBe(200);
	expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);
	const json = await response.json();
	expect(json.data).not.toBeFalsy();
	expect(json.meta).not.toBeFalsy();
	expect(json.meta.ts).not.toBeFalsy();

	// Test AboutVersion fields
	expect(json.data.version).toBe('');

	vi.resetModules(); // nettoie les effets du mock pour les autres tests
});
