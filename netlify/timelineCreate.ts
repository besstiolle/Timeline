
import type { Struct } from "$lib/struct.class"
import {FaunaError} from "../src/faunadb/FaunaError.class"
import { JsonParser } from "../src/lib/jsonParser"

const COLLECTION = 'myCollection'
const INDEXE_WRITE_ASC = 'getTimelineByKeyAndWriteKeyAsc'

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
export async function create(q, client, event, context) {
    
    let timeline: Struct.Timeline = null
    const cars64 = /^[0-9a-zA-Z]{64}$/g

    //Sanitize object
    try{
        timeline = <Struct.Timeline> JSON.parse(event.body, JsonParser.timelineReviver)
    } catch (error){
        return (new FaunaError(["Malformed Request Body", error]).return())
    }
    
    //Case where "writer" user commit a work without "owner" key
    if(timeline.writeKey && !timeline.ownerKey) {
      
      return await client.query(
          //Get first
          q.Get(q.Match(q.Index(INDEXE_WRITE_ASC) , timeline.writeKey, timeline.key))
      ).then((ret) => {
          timeline.ownerKey = ret.data.ownerKey
          return create2(q, client, timeline)    
      })
      .catch((err) => {
          return (new FaunaError(err)).return()
      })
    
    //Case where "owner" user commit a work with all keys
    } else {
      return create2(q, client, timeline)
    }
  }

  async function create2(q, client, timeline: Struct.Timeline){
    return await client.query(
        q.Create(
            q.Collection(COLLECTION),
            {data: timeline}
        )

      ).then((ret) => {
        return {
          statusCode: 201,
          body: JSON.stringify({ message: ret }, null, 2),
        }
      })
      .catch((err) => {
        return (new FaunaError(err)).return()
      })

}