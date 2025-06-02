import type { Database } from 'better-sqlite3';

/**
 * Initiate the database. This function can be called by tests runner.
 * @param db the Database
 */
export function initDatabase(db: Database) {
	// the timeline table
	const stmtTimeline = db.prepare(`CREATE TABLE IF NOT EXISTS timelines 
      (id INTEGER PRIMARY KEY AUTOINCREMENT, 
      key TEXT NOT NULL,
      ownerKey TEXT NOT NULL,
      writeKey TEXT NOT NULL,
      readKey TEXT NOT NULL,
      createdDateTime INT NOT NULL,
      json TEXT NOT NULL
      )`);
	stmtTimeline.run();

	// Create index on key
	const stmtIndexTImelinesKey = db.prepare(
		`CREATE INDEX IF NOT EXISTS index_timeline_key ON timelines(key)`
	);
	stmtIndexTImelinesKey.run();
}
