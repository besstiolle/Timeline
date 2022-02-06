
import type { Struct } from "$lib/struct.class"
import {FaunaError} from "../src/faunadb/FaunaError.class"
import { JsonParser } from "../src/lib/jsonParser"

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
    console.info("create timeline on lambda ")
    
    const COLLECTION = 'myCollection'
    let timeline = null
    //const validStringProperties = ['ownerKey','writeKey','readKey','hash']
    //const validProperties = [...validStringProperties, 'timeline']
    const cars64 = /^[0-9a-zA-Z]{64}$/g

    //let faunaStruct = new FaunaStruct()
    

    let fieldName: string = null 

    //Sanitize object
    try{
        timeline = <Struct.Timeline> JSON.parse(event.body, JsonParser.timelineReviver)
        console.info("timeline.start : %o", timeline)
    } catch (error){
        return (new FaunaError(["Malformed Request Body", error]).return())
    }
    

    return await client.query(
        q.Create(
            q.Collection(COLLECTION),
            {data: timeline}
            //{data: JSON.parse(event.body)}
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