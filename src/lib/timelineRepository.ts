import type { ResponseWithMeta } from '$lib/server/types';
import type { Timeline } from './struct.class';
import { NotFoundOnlineException } from './timelineException.class';

//const endpoint = import.meta.env.VITE_API_ENDPOINT_BASE_URL + '.netlify/functions/timeline?'
const endpoint = '/api/timeline';
const headers = {
	'content-type': 'application/json'
};

export async function create(timeline: Timeline): Promise<ResponseWithMeta> {
	//console.info("POST on endpoint : " + endpoint)
	if (!timeline.ownerKey && !timeline.writeKey) {
		throw new Error(
			'at least you must provide one of theses : ownerKey or writeKey in timeline object'
		);
	}

	const res = await fetch(endpoint, {
		method: 'POST',
		body: JSON.stringify(timeline),
		headers: headers
	});

	return await res.json();
}

export async function get(params: URLSearchParams): Promise<ResponseWithMeta> {
	//console.info("GET on endpoint : " + endpoint + params)
	const key = params.get('key');
	params.delete('key');
	const res = await fetch(endpoint + '/' + key + '?' + params, {
		method: 'GET',
		headers: headers
	}).then((res) => {
		if (res.status == 404) {
			throw new NotFoundOnlineException();
		}
		return res;
	});

	return await res.json();
}

export async function remove(params: URLSearchParams): Promise<string> {
	//console.info("DELETE on endpoint : " + endpoint + params)
	const key = params.get('key');
	params.delete('key');
	const res = await fetch(endpoint + '/' + key + '?' + params, {
		method: 'DELETE',
		headers: headers
	}).then((res) => {
		if (res.status == 404) {
			throw new NotFoundOnlineException();
		}
		return res;
	});

	return await res.text();
}
