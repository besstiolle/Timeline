import { CREDENTIALS_NOT_EQUALS_ProblemJsonResponse } from "$lib/api/problemJson";
import type { Timeline } from "$lib/struct.class";



/**
 * Security control between informations provided and the instance of Timeline
 * @param instance the url of the Request
 * @param timelineFromDb the instance of Timeline
 * @param ownerKey the key of the owner Right
 * @param writeKey the key of the write Right
 * @param readKey the key of the read Right
 * @returns 
 *  null if everything is ok
 *  a 401 Response if a control is not ok
 */
export function accessControl(instance:string, timelineFromDb:Timeline, ownerKey:string|null, writeKey:string|null, readKey:string|null):Response|null{

    if(ownerKey !== null && ownerKey !== timelineFromDb.ownerKey ){
        return new CREDENTIALS_NOT_EQUALS_ProblemJsonResponse(instance, 'ownerKey', ownerKey)
    } else if(writeKey !== null && writeKey !== timelineFromDb.writeKey ){
        return new CREDENTIALS_NOT_EQUALS_ProblemJsonResponse(instance, 'writeKey', writeKey)
    } else if(readKey !== null && readKey !== timelineFromDb.readKey ){
        return new CREDENTIALS_NOT_EQUALS_ProblemJsonResponse(instance, 'readKey', readKey)
    } 
    return null
}