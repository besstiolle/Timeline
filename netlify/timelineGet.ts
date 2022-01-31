
import {FaunaError} from "../src/faunadb/FaunaError.class"

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
export async function get(q, client, event, context) {
    console.info("retrive timeline with informations : ")
    
    const INDEXE_READ = 'getTimelineByKeyAndReadKeyDesc'
    const INDEXE_WRITE = 'getTimelineByKeyAndWriteKeyDesc'
    const INDEXE_OWNER = 'getTimelineByKeyAndOwnerKeyDesc'
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
      indexeToUse = INDEXE_OWNER

    } else if(event.queryStringParameters["writeKey"]) {
      if(!event.queryStringParameters["writeKey"].match(cars64)){
        return (new FaunaError(["Malformed Request parameter", "key `" + "writeKey" + "` wasn't well formated"]).return())
      }
      write = true
      keyToUse = event.queryStringParameters["writeKey"]
      indexeToUse = INDEXE_WRITE

    } else if(event.queryStringParameters["readKey"]) {
      if(!event.queryStringParameters["readKey"].match(cars64)){
        return (new FaunaError(["Malformed Request parameter", "key `" + "readKey" + "` wasn't well formated"]).return())
      }
      read = true
      keyToUse = event.queryStringParameters["readKey"]
      indexeToUse = INDEXE_READ
    } else {
      return (new FaunaError(["Malformed Request parameter", "missing one of theses keys 'ownerKey','writeKey' or 'readKey'"]).return())
    }

    return await client.query(

      //Get first
      q.Get(q.Match(q.Index(indexeToUse) , keyToUse, timelineKey))

    ).then((ret) => {

      //purge data
      if(read || write){
        ret.data.ownerKey = null
      }
      if(read){
        ret.data.writeKey = null
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ message: ret }, null, 2),
      }
    })
    .catch((err) => {
      return (new FaunaError(err)).return()
    })
}
