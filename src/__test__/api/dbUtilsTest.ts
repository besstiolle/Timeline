import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../../lib/server/db/schema';
import path from 'path';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

export function createTestDb(): ReturnType<typeof drizzle> {
	const sqlite = new Database(':memory:');
	const db = drizzle({ client: sqlite, schema, logger: false });

	//Force migration to have the memory db in the good shape
	migrate(db, {
		migrationsFolder: path.resolve(__dirname, '../../../drizzle')
	});

	return db;
}
