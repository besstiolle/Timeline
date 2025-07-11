import { json, type RequestHandler } from '@sveltejs/kit';
import pkg from './../../../../package.json' with { type: 'json' };
import { _FALLBACK, _OPTIONS } from '$lib/api/apiUtils';
import type { ResponseWithMeta } from '$lib/server/types';
import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';
import { countTimeline } from '$lib/server/timelineCRUD';

/**
 * GET /api/about
 * Retrive informations about the current instance
 * @returns
 *  a 200 Response with the information about this instance of TimeChart
 */
export const GET: RequestHandler = async (
	requestEvent: RequestEvent<Partial<Record<string, string>>, string | null>
) => {
	let version = '';

	if (env.SHOW_VERSION != undefined && env.SHOW_VERSION.toLowerCase() === 'true') {
		version = pkg.version;
	}

	const counter = countTimeline(requestEvent.locals.db);

	const objToReturn = {
		version: version,
		count: counter
	};

	//Prepare the standard response with data & meta
	const responseWithMeta: ResponseWithMeta = {
		meta: {
			ts: Date.now(),
			duration: Date.now() - requestEvent.locals.startTimer
		},
		data: objToReturn
	};

	return json(responseWithMeta, { status: 200 });
};

/**
 * default OPTIONS method
 * @returns a 204 Response
 */
export const OPTIONS: RequestHandler = async () => {
	return _OPTIONS(['GET']);
};
/**
 * Fallback method : we refuse the connexion
 * @returns a 405 Response
 */
export const fallback: RequestHandler = async ({ request: requestEvent }) => {
	return _FALLBACK(requestEvent);
};
