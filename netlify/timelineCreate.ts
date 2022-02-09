
import type { Struct } from "$lib/struct.class"
import {FaunaError} from "./FaunaError.class"
import { JsonParser } from "../src/lib/jsonParser"
import { COLLECTION, INDEXES } from "./faunaConstantes"

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

    //Sanitize object
    try{
        timeline = <Struct.Timeline> JSON.parse(event.body, JsonParser.timelineReviver)
    } catch (error){
        return (new FaunaError(["Malformed Request Body", error]).return())
    }
        
    //Default seting : ownerKey on getTimelineByKeyAndOwnerKeyAsc index
    let owKey = timeline.ownerKey
    let index = INDEXES.INDEXE_OWNER_ASC

    //Case where "writer" user commit a work without "owner" key
    //  using writeKey on getTimelineByKeyAndWriteKeyAsc index
    let backport = timeline.writeKey && !timeline.ownerKey
    if(backport) {
      owKey = timeline.writeKey
      index = INDEXES.INDEXE_WRITE_ASC
    }

    return await client.query(
        //Get first of the result set (the older)
        // Or throw an exception if the object wasn't found
        q.Get(q.Match(q.Index(index) , owKey, timeline.key))
    ).then((ret) => {
        // A security if we are a writer user
        // No consequence if we are owner user
        timeline.ownerKey = ret.data.ownerKey
        return update(q, client, ret.ref, timeline)    
    })
    .catch((err) => {

        //If we are in a backport situation
        if(backport) {
          return (new FaunaError(err)).return()
        } else {
          return insert(q, client, timeline)
        }
    })
  }

  /**
   * Subfunction to updating a existing FaunaDB Document
   * @param q a FaunaDb Query
   * @param client a Faunadb Client
   * @param ref a FaunaDb Ref object https://docs.fauna.com/fauna/current/api/fql/functions/ref?lang=javascript
   * @param timeline a <Struct.Timeline> object
   * @returns a exception if necessary or an js object with { statusCode: 201, body: <string> }
   */
  async function update(q, client, ref, timeline: Struct.Timeline){
    return await client.query(
        q.Replace(
          ref, 
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

  /**
   * Subfunction to create a new FaunaDB Document
   * @param q a FaunaDb Query
   * @param client a Faunadb Client
   * @param timeline a <Struct.Timeline> object
   * @returns a exception if necessary or an js object with { statusCode: 201, body: <string> }
   */
async function insert(q, client, timeline: Struct.Timeline){
  return await client.query(
      q.Create(
          q.Collection(COLLECTION.CURRENT_COLLECTION),
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