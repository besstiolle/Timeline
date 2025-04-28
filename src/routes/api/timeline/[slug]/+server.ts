import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { accessControl, controlSlugAndKeys } from '../keyValidator';
import { deleteTimelineByKey, findLastTimelineByKey } from '../repository';
import type { ResponseWithMeta } from '../types';
import type { Struct } from '$lib/struct.class';
import { TIMELINE_NOT_FOUND_ProblemJsonResponse } from '$lib/api/problemJson';
import { _FALLBACK, _OPTIONS, requestToInstance } from '$lib/api/apiUtils';

/**
 * GET /api/timeline/xxxx?o|w|r=xxxxx
 * Retrive an instance of Struct.Timeline
 * @returns 
 *  a 200 Response with the instance of Struct.Timeline 
 *  a 400 Response if there is a malformed parameter
 *  a 401 Response if security keys don't match
 *  a 404 Response if instance is not found
 */
export const GET: RequestHandler = (event) => {

  const instance = requestToInstance(event.request)
  const ownerKey:string|null = event.url.searchParams.get("ownerKey")
  const writeKey:string|null = event.url.searchParams.get("writeKey")
  const readKey:string|null = event.url.searchParams.get("readKey")

  //Control of integrity for our parameters
  const responseControlSlugAndKeys = controlSlugAndKeys(instance, event.params.slug, ownerKey, writeKey, readKey)
  if(responseControlSlugAndKeys != null){return responseControlSlugAndKeys}
  
  const structDb = findLastTimelineByKey(event.locals.db, event.params.slug)
  let timelineFromDb;

  if(structDb !== undefined){
    timelineFromDb = JSON.parse(structDb.json) as Struct.Timeline
  }
  
  if(structDb == undefined || timelineFromDb == undefined){
    return new TIMELINE_NOT_FOUND_ProblemJsonResponse(instance, event.params.slug)
  }

  // Access Control
  const responseAccessControl = accessControl(instance, timelineFromDb,ownerKey,writeKey,readKey)
  if(responseAccessControl !== null){return responseAccessControl}

  //Avoid returning sensibles informations
  if(readKey !== null){
    timelineFromDb.writeKey = null
    timelineFromDb.ownerKey = null
  }else if(writeKey !== null){
    timelineFromDb.ownerKey = null
  }

  //Prepare the standard response with data & meta
  const responseWithMeta:ResponseWithMeta = {
    meta: {
      ts:structDb.createdDateTime,
    },
    data : timelineFromDb
  }

  return json (responseWithMeta, { status: 200 })
}

/**
 * DELETE /api/timeline/xxxx?o=xxxxx
 * Delete a collection of Struct.Timeline based on key
 * @returns 
 *  a 200 Response with the instance of Struct.Timeline 
 *  a 400 Response if there is a malformed parameter
 *  a 401 Response if security keys don't match
 *  a 404 Response if instance is not found
 */
export const DELETE: RequestHandler = (event):Response => {
  const instance = requestToInstance(event.request)
  const ownerKey:string|null = event.url.searchParams.get("ownerKey")

  const responseControlSlugAndKeys = controlSlugAndKeys(instance, event.params.slug, ownerKey, null, null)
  if(responseControlSlugAndKeys != null){return responseControlSlugAndKeys}

  const structDb = findLastTimelineByKey(event.locals.db, event.params.slug)
  let timelineFromDb;

  if(structDb !== undefined){
    timelineFromDb = JSON.parse(structDb.json) as Struct.Timeline
  }
  
  if(structDb == undefined || timelineFromDb == undefined){
    return new TIMELINE_NOT_FOUND_ProblemJsonResponse(instance,event.params.slug)
  }

  // Access Control
  const responseAccessControl = accessControl(instance, timelineFromDb,ownerKey,null,null)
  if(responseAccessControl !== null){return responseAccessControl}
 
  const info = deleteTimelineByKey(event.locals.db, event.params.slug)

  return json(null, { status: 204 });
}


/**
 * default OPTIONS method 
 * @returns a 204 Response
 */
export const OPTIONS: RequestHandler = async (event) => {
  return _OPTIONS(['GET', 'DELETE'])
}

/**
 * Fallback method : we refuse the connexion
 * @returns a 405 Response
 */
export const fallback: RequestHandler = async ({ request }) => {
  return _FALLBACK(request)
};