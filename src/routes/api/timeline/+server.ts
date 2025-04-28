import type { RequestHandler } from './$types';
import type { Struct } from '$lib/struct.class';
import { JsonParser } from '$lib/jsonParser';
import { accessControl } from './keyValidator';
import { findLastTimelineByKey } from './repository';
import type { ResponseWithMeta } from './types';
import { insertTimeline } from './repository';
import { json } from '@sveltejs/kit';
import { controlSlugAndKeys } from './keyValidator';
import { EMPTY_OWNERKEY_ProblemJsonResponse, INVALID_PAYLOAD_ProblemJsonResponse } from '$lib/api/problemJson';
import { requestToInstance as requestToInstance } from '$lib/api/apiUtils';
import { _FALLBACK, _OPTIONS } from '$lib/api/apiUtils';

/**
 * POST /api/timeline
 * Create a new instance of Struct.Timeline in database
 * @returns 
 *  a 201 Response if everything is ok
 *  a 400 Response if there is a malformed body
 *  a 401 Response if security keys don't match
 */
export const POST: RequestHandler = async (event) => {

  const instance = requestToInstance(event.request)
  const db = event.locals.db;

  let timelineFromParam: Struct.Timeline

  //Sanitize object
  try{
      const rawData = await event.request.text();
      //console.info(`rawData = ${rawData}`)
      if(rawData =='{}' || rawData.trim() == '' || rawData.trim() == '""'){
        return new INVALID_PAYLOAD_ProblemJsonResponse(instance)
      }
      timelineFromParam = <Struct.Timeline> JSON.parse(rawData, JsonParser.timelineReviver)
  } catch (error){
    return new INVALID_PAYLOAD_ProblemJsonResponse(instance)
  }
  
  const timelineHash = timelineFromParam.key
  let timelineOwnerKey:string|null = timelineFromParam.ownerKey
  let timelinewriteKey:string|null = timelineFromParam.writeKey
  let timelineReadKey:string|null = timelineFromParam.readKey

  if(timelineOwnerKey == undefined || timelineOwnerKey.trim() == ''){
    timelineOwnerKey = null
  }

  const responseControlSlugAndKeys = controlSlugAndKeys(instance, timelineHash, timelineOwnerKey, timelinewriteKey, timelineReadKey)
  if(responseControlSlugAndKeys != null){return responseControlSlugAndKeys}
  
  //Loading the timeline from db
  const structDb = findLastTimelineByKey(event.locals.db, timelineHash)
  let timelineFromDb;

  if(structDb !== undefined){
    timelineFromDb = JSON.parse(structDb.json) as Struct.Timeline
  }
  
  // Verification with hash + ownerkey ou hash + writekey ou hash + readkey
  if(timelineFromDb !== undefined){
      const response = accessControl(instance, timelineFromDb,timelineOwnerKey,timelinewriteKey,timelineReadKey)
      if(response !== null){return response}
  } else {
    //With no previous existing timeline, we should not have a timeline without ownerkey.
    if(timelineOwnerKey == null){
      return new EMPTY_OWNERKEY_ProblemJsonResponse(instance)
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
    data : timelineFromParam
  }

  return json(responseWithMeta, { status: 201 })
}

/**
 * default OPTIONS method 
 * @returns a 204 Response
 */
export const OPTIONS: RequestHandler = async (event) => {
  return _OPTIONS(['POST'])
}
/**
 * Fallback method : we refuse the connexion
 * @returns a 405 Response
 */
export const fallback: RequestHandler = async ({ request }) => {
  return _FALLBACK(request)
};