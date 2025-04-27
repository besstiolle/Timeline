import type { Struct } from "$lib/struct.class";


const ALPHANUM64 = new RegExp("^[A-Z0-9a-z]{64}$");

/**
 * Integrity's control of slug & the 3 keys.
 * @param slug the key of the Struct.Timeline
 * @param ownerKey the key of the owner Right
 * @param writeKey the key of the write Right
 * @param readKey the key of the read Right
 * @returns 
 *  null if everything is ok
 *  a 400 Response if a control is not ok
 */
export function controlSlugAndKeys(slug:string, ownerKey:string|null, writeKey:string|null, readKey:string|null):Response|null{

    const response:Response|null = controlKey(slug)
    if(response !== null){
        console.error("Slug '%s' didn't respect our regex. Size was %d", slug, slug.length)
        return response
    }
    
    if (ownerKey != null) {
        const response:Response|null = controlKey(ownerKey)
        if(response != null){
            console.error("ownerKey '%s' didn't respect our regex. Size was %d", ownerKey, ownerKey.length)
            return response
        }
    } else if (writeKey !== null) {
        const response:Response|null = controlKey(writeKey)
        if(response != null){
            console.error("ownerKey '%s' didn't respect our regex. Size was %d", ownerKey, writeKey.length)
            return response
        }
    } else if (readKey !== null) {
        const response:Response|null = controlKey(readKey)
        if(response != null){
            console.error("readKey '%s' didn't respect our regex. Size was %d", readKey, readKey.length)
            return response
        }
    } else {
        console.error("no key provided")
        return new Response('Unauthorized Access', { status: 401 });
    }

    return null
}


/**
 * Integrity's control of a key.
 * @param key the key to control
 * @returns 
 *  null if everything is ok
 *  a 400 Response if a control is not ok
 */
export function controlKey(key:string|null):Response|null{

    if(key == null){
        return new Response('Invalid format', { status: 400 });
    }

    //Basic control : Key must be a 64 lenght string
    if(key.length !== 64){
        return new Response('Invalid format', { status: 400 });
    }
  
    //Basic control : Key must be a alpha/num key
    if(!key.match(ALPHANUM64)){
        return new Response('Invalid format', { status: 400 });
    }
  
    return null
}

/**
 * Security control between informations provided and the instance of Struct.Timeline
 * @param timelineFromDb the instance of Struct.Timeline
 * @param ownerKey the key of the owner Right
 * @param writeKey the key of the write Right
 * @param readKey the key of the read Right
 * @returns 
 *  null if everything is ok
 *  a 401 Response if a control is not ok
 */
export function accessControl(timelineFromDb:Struct.Timeline, ownerKey:string|null, writeKey:string|null, readKey:string|null):Response|null{

    if(ownerKey !== null && ownerKey !== timelineFromDb.ownerKey ){
        console.error("ownerKey provided : '%s' different from db value : '%s'",ownerKey, timelineFromDb.ownerKey)
        return new Response('Unauthorized Access', { status: 401 });
    } else if(writeKey !== null && writeKey !== timelineFromDb.writeKey ){
        console.error("writeKey provided : '%s' different from db value : '%s'",writeKey, timelineFromDb.writeKey)
        return new Response('Unauthorized Access', { status: 401 });
    } else if(readKey !== null && readKey !== timelineFromDb.readKey ){
        console.error("readKey provided : '%s' different from db value : '%s'",readKey, timelineFromDb.readKey)
        return new Response('Unauthorized Access', { status: 401 });
    } 
    return null
}