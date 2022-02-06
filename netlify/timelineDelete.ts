

import {FaunaError} from "../src/faunadb/FaunaError.class"

const INDEXE_OWNER_DESC = 'getTimelineByKeyAndOwnerKeyAsc'
const INDEXE_OWNER = 'getTimelineByKeyAndOwnerKeyDesc'
const INDEXE_WRITE = 'getTimelineByKeyAndWriteKeyDesc'
const INDEXE_READ = 'getTimelineByKeyAndReadKeyDesc'

/**
 *  @param event : {
 *    "path": "Path parameter (original URL encoding)",
 *    "httpMethod": "Incoming request’s method name",
 *    "headers": {Incoming request headers},
 *    "queryStringParameters": {Query string parameters},
 *    "body": "A JSON string of the request payload",
 *    "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encoded"
 * }
 *  @context : <todo>
 *  @return : {
 *    "isBase64Encoded": true|false,
 *    "statusCode": httpStatusCode,
 *    "headers": { "headerName": "headerValue", ... },
 *    "multiValueHeaders": { "headerName": ["headerValue", "headerValue2", ...], ... },
 *    "body": "..."
 *  }
 *  @see : https://docs.netlify.com/functions/build-with-javascript/
 */
export async function remove(q, client, event, context) {
    console.info("delete timeline on lambda ")
    
    const cars64 = /^[0-9a-zA-Z]{64}$/g
    const cars10 = /^[0-9a-zA-Z]{10}$/g

    if(!event.queryStringParameters["key"] || !event.queryStringParameters["key"].match(cars10)){
      return (new FaunaError(["Malformed Request Body", "key `" + "key" + "` wasn't well formated"]).return())
    }

    let timelineKey:string = event.queryStringParameters["key"]
    let owner:boolean, write:boolean, read:boolean = false
    let indexeToUse: string = null
    let keyToUse: string = null

    if(event.queryStringParameters["ownerKey"]) {
      if(!event.queryStringParameters["ownerKey"].match(cars64)){
        return (new FaunaError(["Malformed Request parameter", "key `" + "ownerKey" + "` wasn't well formated"]).return())
      }
      owner = true
      keyToUse = event.queryStringParameters["ownerKey"]
      indexeToUse = INDEXE_OWNER_DESC
    } else {
      return (new FaunaError(["Malformed Request parameter", "missing key 'ownerKey'"]).return())
    }

    return await client.query(
        //Get first
        q.Get(q.Match(q.Index(indexeToUse) , keyToUse, timelineKey))
    ).then((ret) => {
        let ownerKey = ret.data.ownerKey
        let writeKey = ret.data.writeKey
        let readKey = ret.data.readKey
        return remove2(q, client, timelineKey, ownerKey, writeKey, readKey)    
    })
    .catch((err) => {
        return (new FaunaError(err)).return()
    })
}

async function remove2(q, client, timelineKey: string, ownerKey: string, writeKey: string, readKey: string){

    return await client.query(
       q.Foreach(
            q.Paginate(q.Union(
                q.Match(q.Index(INDEXE_OWNER), ownerKey, timelineKey),
                q.Match(q.Index(INDEXE_WRITE), writeKey, timelineKey),
                q.Match(q.Index(INDEXE_READ),  readKey, timelineKey),
            )),q.Lambda('myRef',
            q.Delete(
                q.Var('myRef')
            ))
        )       
        
    ).then((ret) => {
        return {
            statusCode: 202,
            body: JSON.stringify({ message: ret }, null, 2),
        }
    })
    .catch((err) => {
        throw err
    })

    
}
