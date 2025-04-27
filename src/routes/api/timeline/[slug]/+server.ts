import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { accessControl, controlKey, controlSlugAndKeys } from '../keyValidator';
import { deleteTimelineByKey, findLastTimelineByKey } from '../repository';
import type { ResponseWithMeta } from '../types';
import type { Struct } from '$lib/struct.class';

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

  const ownerKey:string|null = event.url.searchParams.get("ownerKey")
  const writeKey:string|null = event.url.searchParams.get("writeKey")
  const readKey:string|null = event.url.searchParams.get("readKey")

  //Control of integrity for our parameters
  const responseControlSlugAndKeys = controlSlugAndKeys(event.params.slug, ownerKey, writeKey, readKey)
  if(responseControlSlugAndKeys != null){return responseControlSlugAndKeys}
  
  const structDb = findLastTimelineByKey(event.locals.db, event.params.slug)
  let timelineFromDb;

  if(structDb !== undefined){
    timelineFromDb = JSON.parse(structDb.json) as Struct.Timeline
  }
  
  if(structDb == undefined || timelineFromDb == undefined){
    console.error("key : '%s' not found", event.params.slug)
    return new Response('Not Found', { status: 404 });
  }

  // Access Control
  const responseAccessControl = accessControl(timelineFromDb,ownerKey,writeKey,readKey)
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

  return json (responseWithMeta)
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
  const ownerKey:string|null = event.url.searchParams.get("ownerKey")

  //Control of integrity for our parameters
  const responseControlSlug = controlKey(event.params.slug)
  if(responseControlSlug !== null){return responseControlSlug}
  
  const responseControlKey = controlKey(ownerKey)
  if(responseControlKey !== null){return responseControlKey}
  
  const structDb = findLastTimelineByKey(event.locals.db, event.params.slug)
  let timelineFromDb;

  if(structDb !== undefined){
    timelineFromDb = JSON.parse(structDb.json) as Struct.Timeline
  }
  
  if(structDb == undefined || timelineFromDb == undefined){
    console.error("key : '%s' not found", event.params.slug)
    return new Response('Not Found', { status: 404 });
  }



  // Access Control
  const responseAccessControl = accessControl(timelineFromDb,ownerKey,null,null)
  if(responseAccessControl !== null){return responseAccessControl}

  //TODO delete collection
  const info = deleteTimelineByKey(event.locals.db, event.params.slug)
  console.info("deleted %d instances of Timeline with key %s",info.changes,event.params.slug)

  return new Response(null, { status: 204 })
}


/**
 * default OPTIONS method 
 * @returns a 200 Response
 */
export const OPTIONS: RequestHandler = async (event) => {
  return new Response('OK', { status: 200 });
}

/**
 * Fallback method : we refuse the connexion
 * @returns a 405 Response
 */
export const fallback: RequestHandler = async ({ request }) => {
	return new Response("Method Not Allowed", { status: 405 })
};