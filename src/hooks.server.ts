import type { Handle } from '@sveltejs/kit';
import Database from 'better-sqlite3';

export const handle: Handle = async ({ event, resolve }) => {
  if (!event.locals.db) {
    // This will create the database within the `db.sqlite` file.
    const db = new Database('db.sqlite')
    

    db.pragma('journal_mode = WAL');

    // Set the db as our events.db variable.
    event.locals.db = db

    // the timeline table
    const stmtTimeline = db.prepare(`CREATE TABLE IF NOT EXISTS timelines 
      (id INTEGER PRIMARY KEY AUTOINCREMENT, 
      key TEXT NOT NULL,
      ownerKey TEXT NOT NULL,
      writeKey TEXT NOT NULL,
      readKey TEXT NOT NULL,
      createdDateTime INT NOT NULL,
      json TEXT NOT NULL
      )`)
    stmtTimeline.run()

    // Create index on key
    const stmtIndexTImelinesKey = db.prepare(`CREATE INDEX IF NOT EXISTS index_timeline_key ON timelines(key)`)
    stmtIndexTImelinesKey.run()

  }
  const resp = await resolve(event);
  return resp;
};