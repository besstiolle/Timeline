
import { json, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import { _FALLBACK, _OPTIONS } from '$lib/api/apiUtils';
import type { ResponseWithMeta } from '../../api/timeline/types';


const ALPHANUM64 = new RegExp("^[A-Z0-9a-z]{64}$");

/**
 * POST /g/[slug]
 * Uploading a .csv / .toml backup
 * @returns 
 *  a 201 Response if everything is ok
 *  a 400 Response if there is a malformed body
 *  a 401 Response if security keys don't match
 */
export const POST: RequestHandler = async (requestEvent: RequestEvent<Partial<Record<string, string>>, string | null>) => {

  
  //Prepare the standard response with data & meta
  const responseWithMeta:ResponseWithMeta = {
    meta: {
      ts:Date.now()
    },
    data : {}
  }

  return json(responseWithMeta, { status: 201 })
}

/**
 * default OPTIONS method 
 * @returns a 204 Response
 */
export const OPTIONS: RequestHandler = async (requestEvent: RequestEvent<Partial<Record<string, string>>, string | null>) => {
  return _OPTIONS(['POST'])
}
/**
 * Fallback method : we refuse the connexion
 * @returns a 405 Response
 */
export const fallback: RequestHandler = async ({ request: requestEvent }) => {
  return _FALLBACK(requestEvent)
};

