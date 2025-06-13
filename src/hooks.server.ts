import type { Handle, ServerInit } from '@sveltejs/kit';

import { paraglideMiddleware } from './paraglide/server';
import { db } from '$lib/server/db';
import { migrateTimeChart } from '$lib/server/drizzleMigrator';

/**
 * This function runs every time the SvelteKit server receives a request
 * See more : https://svelte.dev/docs/kit/hooks#Server-hooks-handle
 */
export const handle: Handle = async ({ event, resolve }) => {
	//Initiate internal timer
	event.locals.startTimer = Date.now();

	//Passing database
	if (!event.locals.db) {
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

/**
 * Run once, when the server is created.
 * See more : https://svelte.dev/docs/kit/hooks#Shared-hooks-init
 */
export const init: ServerInit = async () => {
	//Apply the migration strategy
	migrateTimeChart();
};
