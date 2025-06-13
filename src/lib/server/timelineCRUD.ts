import type { Timeline } from '$lib/struct.class';
import { count, desc, eq, type InferSelectModel } from 'drizzle-orm';
import { timelines } from './db/schema';
import type { drizzle } from 'drizzle-orm/better-sqlite3';

type StructTimelineInDbInterface = InferSelectModel<typeof timelines>;

/**
 * return the number of instance of StructTimelineInDbInterface
 * @param db the Drizzle Database
 * @returns an number of StructTimelineInDbInterface object if found or 0
 */
export function countTimeline(db: ReturnType<typeof drizzle>): number {
	return db
		.select({ count: count() })
		.from(timelines)
		.get()?.count as number;
}

/**
 * return the number of instance of StructTimelineInDbInterface by key
 * @param db the Drizzle Database
 * @param key the indexed key
 * @returns an number of StructTimelineInDbInterface object if found or 0
 */
export function countTimelineByKey(db: ReturnType<typeof drizzle>, key: string): number {
	return db
		.select({ count: count() })
		.from(timelines)
		.where(eq(timelines.key, key))
		.get()?.count as number;
}
/**
 * return the most recent instance of StructTimelineInDbInterface or undefined if not found
 * @param db the Drizzle Database
 * @param key the indexed key
 * @returns an instance of StructTimelineInDbInterface object if found or undefined
 */
export function findLastTimelineByKey(
	db: ReturnType<typeof drizzle>,
	key: string
): StructTimelineInDbInterface | undefined {
	return db
		.select()
		.from(timelines)
		.where(eq(timelines.key, key))
		.orderBy(desc(timelines.id))
		.limit(1)
		.get();
}

/**
 * Insert a new Timeline
 * @param db the Drizzle Database
 * @param timeline an instance of Timeline object
 * @returns void
 */
export function insertTimeline(db: ReturnType<typeof drizzle>, timeline: Timeline): void {
	db.insert(timelines)
		.values({
			key: timeline.key,
			ownerKey: timeline.ownerKey as string,
			writeKey: timeline.writeKey as string,
			readKey: timeline.readKey as string,
			createdDateTime: Date.now(),
			json: JSON.stringify(timeline)
		})
		.run();
}

/**
 * Delete a collection of Timeline based on key parameter
 * @param db the Drizzle Database
 * @param key the indexed key
 * @returns void
 */
export function deleteTimelineByKey(db: ReturnType<typeof drizzle>, key: string): void {
	db.delete(timelines).where(eq(timelines.key, key)).run();
}

/**
 * Delete all collections of Timeline (used only in testing part)
 * @param db the Drizzle Database
 * @returns void
 */
export function truncateTimeline(db: ReturnType<typeof drizzle>): void {
	db.delete(timelines).run();
}
