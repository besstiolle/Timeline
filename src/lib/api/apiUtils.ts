import { json } from '@sveltejs/kit';
import { METHOD_NOT_ALLOWED_ProblemJsonResponse } from './problemJson';

/**
 * Transforme full url to path like : /api/timeline/xxx?ownerKey=yyy
 * @param request the current request
 * @returns the instance for ProblemJsonResponse Object
 */
export function requestToInstance(request: Request): string {
	const reqURL = new URL(request.url);
	return reqURL.pathname + reqURL.search;
}

/**
 * default OPTIONS method
 * @returns a 204 Response
 */
export function _OPTIONS(allowedMethods: string[]): Response {
	allowedMethods.push('OPTIONS');
	const headerMethods = allowedMethods.join(', ');
	const headers = new Headers();
	const encoder = new TextEncoder();
	headers.set('content-length', encoder.encode('').byteLength.toString());
	headers.set('Allow', headerMethods);
	headers.set('Access-Control-Allow-Methods', headerMethods);
	headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	headers.set('Access-Control-Allow-Origin', 'null');
	return json(undefined, { status: 204, headers: headers });
}

/**
 * Fallback method : we refuse the connexion
 * @returns a 405 Response
 */
export function _FALLBACK(request: Request): Response {
	const instance = requestToInstance(request);
	return new METHOD_NOT_ALLOWED_ProblemJsonResponse(instance, request.method);
}
