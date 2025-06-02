import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { accessControl } from '../keyValidator';
import { deleteTimelineByKey, findLastTimelineByKey } from '../repository';
import type { ResponseWithMeta } from '../types';
import { TIMELINE_NOT_FOUND_ProblemJsonResponse } from '$lib/api/problemJson';
import { _FALLBACK, _OPTIONS, requestToInstance } from '$lib/api/apiUtils';
import { REGEX_FAILED_ProblemJsonResponse } from '$lib/api/problemJson';
import { EMPTY_KEYS_ProblemJsonResponse } from '$lib/api/problemJson';
import type { RequestEvent } from '@sveltejs/kit';
import type { Timeline } from '$lib/struct.class';

const ALPHANUM64 = new RegExp('^[A-Z0-9a-z]{64}$');
/**
 * GET /api/timeline/xxxx?o|w|r=xxxxx
 * Retrive an instance of Timeline
 * @returns
 *  a 200 Response with the instance of Timeline
 *  a 400 Response if there is a malformed parameter
 *  a 401 Response if security keys don't match
 *  a 404 Response if instance is not found
 */
export const GET: RequestHandler = (
	requestEvent: RequestEvent<Partial<Record<string, string>>, string | null>
) => {
	const instance = requestToInstance(requestEvent.request);
	const slug = requestEvent.params.slug;
	const ownerKey: string | null = requestEvent.url.searchParams.get('ownerKey');
	const writeKey: string | null = requestEvent.url.searchParams.get('writeKey');
	const readKey: string | null = requestEvent.url.searchParams.get('readKey');

	//Control of integrity for our parameters
	if (slug == undefined || !slug.match(ALPHANUM64)) {
		return new REGEX_FAILED_ProblemJsonResponse(
			instance,
			'slug',
			slug ? slug : '',
			ALPHANUM64.source
		);
	}
	if (ownerKey !== null && !ownerKey.match(ALPHANUM64)) {
		const value = ownerKey == null ? '' : ownerKey;
		return new REGEX_FAILED_ProblemJsonResponse(instance, 'ownerKey', value, ALPHANUM64.source);
	}
	if (writeKey !== null && !writeKey.match(ALPHANUM64)) {
		const value = writeKey == null ? '' : writeKey;
		return new REGEX_FAILED_ProblemJsonResponse(instance, 'writeKey', value, ALPHANUM64.source);
	}
	if (readKey !== null && !readKey.match(ALPHANUM64)) {
		const value = readKey == null ? '' : readKey;
		return new REGEX_FAILED_ProblemJsonResponse(instance, 'readKey', value, ALPHANUM64.source);
	}
	if (ownerKey == null && writeKey == null && readKey == null) {
		return new EMPTY_KEYS_ProblemJsonResponse(instance);
	}

	const structDb = findLastTimelineByKey(requestEvent.locals.db, slug);
	let timelineFromDb;

	if (structDb !== undefined) {
		timelineFromDb = JSON.parse(structDb.json) as Timeline;
	}

	if (structDb == undefined || timelineFromDb == undefined) {
		return new TIMELINE_NOT_FOUND_ProblemJsonResponse(instance, slug);
	}

	// Access Control
	const responseAccessControl = accessControl(
		instance,
		timelineFromDb,
		ownerKey,
		writeKey,
		readKey
	);
	if (responseAccessControl !== null) {
		return responseAccessControl;
	}

	//Avoid returning sensibles informations
	if (readKey !== null) {
		timelineFromDb.writeKey = null;
		timelineFromDb.ownerKey = null;
	} else if (writeKey !== null) {
		timelineFromDb.ownerKey = null;
	}

	//Prepare the standard response with data & meta
	const responseWithMeta: ResponseWithMeta = {
		meta: {
			ts: structDb.createdDateTime
		},
		data: timelineFromDb
	};

	return json(responseWithMeta, { status: 200 });
};

/**
 * DELETE /api/timeline/xxxx?o=xxxxx
 * Delete a collection of Timeline based on key
 * @returns
 *  a 200 Response with the instance of Timeline
 *  a 400 Response if there is a malformed parameter
 *  a 401 Response if security keys don't match
 *  a 404 Response if instance is not found
 */
export const DELETE: RequestHandler = (
	requestEvent: RequestEvent<Partial<Record<string, string>>, string | null>
): Response => {
	const instance = requestToInstance(requestEvent.request);
	const slug = requestEvent.params.slug;
	const ownerKey: string | null = requestEvent.url?.searchParams?.get('ownerKey');

	//Control format of Slug & OwnerKey
	if (slug == undefined || !slug.match(ALPHANUM64)) {
		return new REGEX_FAILED_ProblemJsonResponse(
			instance,
			'slug',
			slug ? slug : '',
			ALPHANUM64.source
		);
	}
	if (ownerKey == null || !ownerKey.match(ALPHANUM64)) {
		const value = ownerKey == null ? '' : ownerKey;
		return new REGEX_FAILED_ProblemJsonResponse(instance, 'ownerKey', value, ALPHANUM64.source);
	}

	const structDb = findLastTimelineByKey(requestEvent.locals.db, slug);
	let timelineFromDb;

	if (structDb !== undefined) {
		timelineFromDb = JSON.parse(structDb.json) as Timeline;
	}

	if (structDb == undefined || timelineFromDb == undefined) {
		return new TIMELINE_NOT_FOUND_ProblemJsonResponse(instance, slug);
	}

	// Access Control
	const responseAccessControl = accessControl(instance, timelineFromDb, ownerKey, null, null);
	if (responseAccessControl !== null) {
		return responseAccessControl;
	}

	deleteTimelineByKey(requestEvent.locals.db, slug);

	return json(undefined, { status: 204 });
};

/**
 * default OPTIONS method
 * @returns a 204 Response
 */
export const OPTIONS: RequestHandler = async () => {
	return _OPTIONS(['GET', 'DELETE']);
};

/**
 * Fallback method : we refuse the connexion
 * @returns a 405 Response
 */
export const fallback: RequestHandler = async ({ request: requestEvent }) => {
	return _FALLBACK(requestEvent);
};
