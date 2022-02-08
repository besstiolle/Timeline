

import {FaunaError} from "./FaunaError.class"
import { INDEXES, REGEX } from "./faunaConstantes"


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
    

    if(!event.queryStringParameters["key"] || !event.queryStringParameters["key"].match(REGEX.ALPHANUM10)){
      return (new FaunaError(["Malformed Request Body", "key `" + "key" + "` wasn't well formated"]).return())
    }

    let timelineKey:string = event.queryStringParameters["key"]
    let owner:boolean, write:boolean, read:boolean = false
    let indexeToUse: string = null
    let keyToUse: string = null

    if(event.queryStringParameters["ownerKey"]) {
      if(!event.queryStringParameters["ownerKey"].match(REGEX.ALPHANUM64)){
        return (new FaunaError(["Malformed Request parameter", "key `" + "ownerKey" + "` wasn't well formated"]).return())
      }
      owner = true
      keyToUse = event.queryStringParameters["ownerKey"]
      indexeToUse = INDEXES.INDEXE_OWNER_ASC
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
                q.Match(q.Index(INDEXES.INDEXE_OWNER_DESC), ownerKey, timelineKey),
                q.Match(q.Index(INDEXES.INDEXE_WRITE_DESC), writeKey, timelineKey),
                q.Match(q.Index(INDEXES.INDEXE_READ_DESC),  readKey, timelineKey),
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
        return (new FaunaError(err)).return()
    })

    
}
