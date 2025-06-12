import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '$lib/server/db/schema'; 

const databasePath = 'db/db.sqlite'
const sqlite = new Database(databasePath);
sqlite.pragma('journal_mode = WAL');
export const db = drizzle(sqlite, { schema });