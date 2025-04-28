import { EMPTY_KEYS_ProblemJsonResponse, CREDENTIALS_NOT_EQUALS_ProblemJsonResponse, REGEX_FAILED_ProblemJsonResponse } from "$lib/api/problemJson";
import type { Struct } from "$lib/struct.class";


const ALPHANUM64 = new RegExp("^[A-Z0-9a-z]{64}$");

/**
 * Integrity's control of slug & the 3 keys.
 * @param instance the url of the Request
 * @param slug the key of the Struct.Timeline
 * @param ownerKey the key of the owner Right
 * @param writeKey the key of the write Right
 * @param readKey the key of the read Right
 * @returns 
 *  null if everything is ok
 *  a 400 Response if a control is not ok
 */
export function controlSlugAndKeys(instance:string,slug:string, ownerKey:string|null, writeKey:string|null, readKey:string|null):Response|null{

    if(slug==null || !slug.match(ALPHANUM64)){
        return new REGEX_FAILED_ProblemJsonResponse(instance,'slug',slug,ALPHANUM64.source)
    }
    if(ownerKey!==null && !ownerKey.match(ALPHANUM64)){
        const value = (ownerKey==null?ownerKey='':ownerKey)
        return new REGEX_FAILED_ProblemJsonResponse(instance,'ownerKey',value,ALPHANUM64.source)
    }
    if(writeKey==null || !writeKey.match(ALPHANUM64)){
        const value = (writeKey==null?writeKey='':writeKey)
        return new REGEX_FAILED_ProblemJsonResponse(instance,'writeKey',value,ALPHANUM64.source)
    }
    if(readKey==null || !readKey.match(ALPHANUM64)){
        const value = (readKey==null?readKey='':readKey)
        return new REGEX_FAILED_ProblemJsonResponse(instance,'readKey',value,ALPHANUM64.source)
    }
    if(ownerKey == null && writeKey == null && readKey == null){
        return new EMPTY_KEYS_ProblemJsonResponse(instance)
    }
    return null
}

/**
 * Security control between informations provided and the instance of Struct.Timeline
 * @param instance the url of the Request
 * @param timelineFromDb the instance of Struct.Timeline
 * @param ownerKey the key of the owner Right
 * @param writeKey the key of the write Right
 * @param readKey the key of the read Right
 * @returns 
 *  null if everything is ok
 *  a 401 Response if a control is not ok
 */
export function accessControl(instance:string, timelineFromDb:Struct.Timeline, ownerKey:string|null, writeKey:string|null, readKey:string|null):Response|null{

    if(ownerKey !== null && ownerKey !== timelineFromDb.ownerKey ){
        return new CREDENTIALS_NOT_EQUALS_ProblemJsonResponse(instance, 'ownerKey', ownerKey)
    } else if(writeKey !== null && writeKey !== timelineFromDb.writeKey ){
        return new CREDENTIALS_NOT_EQUALS_ProblemJsonResponse(instance, 'writeKey', writeKey)
    } else if(readKey !== null && readKey !== timelineFromDb.readKey ){
        return new CREDENTIALS_NOT_EQUALS_ProblemJsonResponse(instance, 'readKey', readKey)
    } 
    return null
}