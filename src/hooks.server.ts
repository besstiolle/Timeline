import type { Handle } from '@sveltejs/kit';

import { paraglideMiddleware } from './paraglide/server';
import { db } from '$lib/server/db';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import path from 'path';

export const handle: Handle = async ({ event, resolve }) => {
	//Initiate internal timer
	event.locals.startTimer = Date.now();

	//Passing database
	if (!event.locals.db) {
		//Apply Drizzle migration
		migrate(db, {
			migrationsFolder: path.resolve('./drizzle')
		});

		//Apply the db to the request
		event.locals.db = db;
	}
	// --- Middleware Paraglide ---
	const response = await paraglideMiddleware(
		event.request,
		async ({ request: localizedRequest, locale }) => {
			event.request = localizedRequest;

			return resolve(event, {
				transformPageChunk: ({ html }) => html.replace('%lang%', locale)
			});
		}
	);
	return response;
};
