

import { json, type RequestHandler } from '@sveltejs/kit';
import pkg from './../../../../package.json' with { type: 'json' };
import { _FALLBACK, _OPTIONS } from '$lib/api/apiUtils';
import type { ResponseWithMeta } from '../timeline/types';

/**
 * GET /api/about
 * Retrive informations about the current instance
 * @returns 
 *  a 200 Response with the information about this instance of TimeChart
 */
export const GET: RequestHandler = () => {

  const objToReturn = {
    "version" : pkg.version
  }

  //Prepare the standard response with data & meta
  const responseWithMeta:ResponseWithMeta = {
    meta: {
      ts:Date.now(),
    },
    data : objToReturn
  }

  return json (responseWithMeta, { status: 200 })
}


/**
 * default OPTIONS method 
 * @returns a 204 Response
 */
export const OPTIONS: RequestHandler = async () => {
  return _OPTIONS(['GET'])
}
/**
 * Fallback method : we refuse the connexion
 * @returns a 405 Response
 */
export const fallback: RequestHandler = async ({ request: requestEvent }) => {
  return _FALLBACK(requestEvent)
}