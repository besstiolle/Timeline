import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
	countTimelineByKey,
	deleteTimelineByKey,
	findLastTimelineByKey,
	insertTimeline,
	truncateTimeline
} from '$lib/server/timelineCRUD';
import type { drizzle } from 'drizzle-orm/better-sqlite3';
import { createTestDb } from '../api/dbUtilsTest';
import { getValideDummyTimeline } from '../api/apiUtils';

let db: ReturnType<typeof drizzle>;

beforeEach(async () => {
	//Initiate the memory db for testing with the real struct of our database
	db = await createTestDb();

	//Mock console.error() to avoid vi console pollution
	vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('Test SQLite Db mock with Drizzle', () => {
	it('Db must be memory state', async () => {
		expect(db.$client.memory).toBe(true);
	});

	it('Test basic connexion', async () => {
		const result = await db.all('select 1');
		expect(result).toStrictEqual([{ '1': 1 }]);
	});

	it('Test tables existences', async () => {
		const result = await db.all("SELECT name FROM sqlite_master WHERE type = 'table';");
		expect(result.length).toBe(3);
	});

	it('Test repository CRUD execution', async () => {
		const BadKey = 'X';

		expect(countTimelineByKey(db, getValideDummyTimeline().key)).toBe(0);
		expect(findLastTimelineByKey(db, getValideDummyTimeline().key)).toBe(undefined);
		insertTimeline(db, getValideDummyTimeline());

		expect(countTimelineByKey(db, getValideDummyTimeline().key)).toBe(1);
		expect(countTimelineByKey(db, BadKey)).toBe(0);
		expect(findLastTimelineByKey(db, getValideDummyTimeline().key)?.key).toBe(getValideDummyTimeline().key);

		//False deletion
		deleteTimelineByKey(db, BadKey);
		expect(countTimelineByKey(db, getValideDummyTimeline().key)).toBe(1);

		//Real deletion
		deleteTimelineByKey(db, getValideDummyTimeline().key);
		expect(countTimelineByKey(db, getValideDummyTimeline().key)).toBe(0);
	});

	it('Test repository truncate execution', async () => {
		expect(countTimelineByKey(db, getValideDummyTimeline().key)).toBe(0);
		insertTimeline(db, getValideDummyTimeline());
		insertTimeline(db, getValideDummyTimeline());
		insertTimeline(db, getValideDummyTimeline());

		expect(countTimelineByKey(db, getValideDummyTimeline().key)).toBe(3);

		truncateTimeline(db);

		expect(countTimelineByKey(db, getValideDummyTimeline().key)).toBe(0);
	});
});
