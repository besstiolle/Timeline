import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'path';
import { db } from './db';

export function migrateTimeChart() {
	console.info('Start migrating database');

	//Apply Drizzle migration
	migrate(db, {
		migrationsFolder: path.resolve('./drizzle')
	});
}
