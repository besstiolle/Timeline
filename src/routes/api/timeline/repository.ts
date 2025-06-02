import type { Database, RunResult } from 'better-sqlite3';
import type { StructTimelineInDbInterface } from './types';
import type { Timeline } from '$lib/struct.class';

/**
 * return the number of instance of StructTimelineInDbInterface by key
 * @param db the Database
 * @param key the indexed key
 * @returns an number of StructTimelineInDbInterface object if found or 0
 */
export function countTimelineByKey(db: Database, key: string): number {
	const stmtFindExistingTimeline = db.prepare(
		'SELECT count(*) as count FROM timelines WHERE key = ?'
	);
	const countDb = (stmtFindExistingTimeline.get(key) as { count: number }).count;

	return countDb;
}

/**
 * return the most recent instance of StructTimelineInDbInterface or undefined if not found
 * @param db the Database
 * @param key the indexed key
 * @returns an instance of StructTimelineInDbInterface object if found or undefined
 */
export function findLastTimelineByKey(
	db: Database,
	key: string
): StructTimelineInDbInterface | undefined {
	const stmtFindExistingTimeline = db.prepare(
		'SELECT * FROM timelines WHERE key = ? ORDER BY id DESC limit 1'
	);
	const structDb = stmtFindExistingTimeline.get(key) as StructTimelineInDbInterface;

	return structDb;
}

/**
 * Insert a new Timeline
 * @param db the Database
 * @param timeline an instance of Timeline object
 * @returns a RunResult of the operations
 */
export function insertTimeline(db: Database, timeline: Timeline): RunResult {
	const stmtInsertion = db.prepare(`INSERT INTO timelines 
    (key, ownerkey, writekey, readKey, createdDateTime, json)
    values
    (@key, @ownerkey, @writekey, @readKey, @createdDateTime ,@json)`);

	const dataToInsert: StructTimelineInDbInterface = {
		key: timeline.key,
		ownerkey: timeline.ownerKey,
		writekey: timeline.writeKey,
		readKey: timeline.readKey,
		createdDateTime: Date.now(),
		json: JSON.stringify(timeline)
	};

	return stmtInsertion.run(dataToInsert);
}

/**
 * Delete a collection of Timeline based on key parameter
 * @param db the Database
 * @param key the indexed key
 * @returns a RunResult of the operations
 */
export function deleteTimelineByKey(db: Database, key: string): RunResult {
	const stmtDeleteTimelineByKey = db.prepare('DELETE FROM timelines WHERE key = ?');
	return stmtDeleteTimelineByKey.run(key);
}
