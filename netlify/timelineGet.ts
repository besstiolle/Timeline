
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
export async function get(fauna, client, event, context) {
    console.info("retrive timeline with informations : ")
    
    return await client.query(
        //TODO stuff
        //const data = JSON.parse(event.body)

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