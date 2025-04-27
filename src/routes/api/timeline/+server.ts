import type { RequestHandler } from './$types';
import type { Struct } from '$lib/struct.class';
import { JsonParser } from '$lib/jsonParser';
import { accessControl, controlKey } from './keyValidator';
import { findLastTimelineByKey } from './repository';
import type { ResponseWithMeta, StructTimelineInDbInterface } from './types';
import { insertTimeline } from './repository';

/**
 * POST /api/timeline
 * Create a new instance of Struct.Timeline in database
 * @returns 
 *  a 201 Response if everything is ok
 *  a 400 Response if there is a malformed body
 *  a 401 Response if security keys don't match
 *  a 404 Response if instance is not found
 */
export const POST: RequestHandler = async (event) => {

  const db = event.locals.db;

  let timelineFromParam: Struct.Timeline
  let rawData

  //Sanitize object
  try{
      rawData = await event.request.text();
      timelineFromParam = <Struct.Timeline> JSON.parse(rawData, JsonParser.timelineReviver)
  } catch (error){
    console.error("body can't be parsed : ", error)
    return new Response('Invalid body format', { status: 400 });
  }
  
  const timelineHash = timelineFromParam.key
  let timelineOwnerKey:string|null = timelineFromParam.ownerKey
  let timelinewriteKey:string|null = timelineFromParam.writeKey
  let timelineReadKey:string|null = timelineFromParam.readKey

  const responseHashKey = controlKey(timelineHash)
  if(responseHashKey !== null){
    console.error("hash : '%s' not provided or not validated", timelineHash)
    return responseHashKey
  }

  if(timelineOwnerKey == undefined || timelineOwnerKey.trim() == ''){
    timelineOwnerKey = null
  } else {
    const responseOwnerKey = controlKey(timelineOwnerKey)
    if(responseOwnerKey !== null){
      console.error("ownerKey : '%s'provided but not validated", timelineOwnerKey)
      return responseOwnerKey
    }
  }
 
  const responseWriteKey = controlKey(timelinewriteKey)
  if(responseWriteKey !== null){
    console.error("writekey : '%s' not provided or not validated", timelinewriteKey)
    return responseWriteKey
  }
  const responseReadKey = controlKey(timelineReadKey)
  if(responseReadKey !== null){
    console.error("readkey : '%s' not provided or not validated", timelineReadKey)
    return responseReadKey
  }
  
  //Loading the timeline from db
  //const timelineFromDb = findLastTimelineByKey(db, timelineHash)
  const structDb = findLastTimelineByKey(event.locals.db, timelineHash)
  let timelineFromDb;

  if(structDb !== undefined){
    timelineFromDb = JSON.parse(structDb.json) as Struct.Timeline
  }


  
  // Verification with hash + ownerkey ou hash + writekey ou hash + readkey
  if(timelineFromDb !== undefined){
      const response = accessControl(timelineFromDb,timelineOwnerKey,timelinewriteKey,timelineReadKey)
      if(response !== null){return response}
  } else {
    //With no previous existing timeline, we should not have a timeline without ownerkey.
    if(timelineOwnerKey == null){
      console.error("ownerKey not provided for the first creation")
      return new Response('Unauthorized Access', { status: 401 });
    }
  }

  //Prepare a clone for insertion
  let timelineForInsertion = structuredClone(timelineFromParam)

  //We can retrive ownerKey from db if existing (case : a write push a Timeline)
  if(timelineFromDb !== undefined && timelineOwnerKey == null){
    timelineForInsertion.ownerKey = timelineFromDb.ownerKey
  }

  //Insert only
  insertTimeline(db, timelineForInsertion)

  //Prepare the standard response with data & meta
  const responseWithMeta:ResponseWithMeta = {
    meta: {
      ts:Date.now()
    },
    data : timelineForInsertion
  }

  return new Response(JSON.stringify(responseWithMeta), { status: 201 });
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