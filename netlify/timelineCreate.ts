
import {FaunaError} from "../src/faunadb/FaunaError.class"
import { FaunaStruct } from "../src/faunadb/faunaStruct.class"
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
export async function create(fauna, client, event, context) {
    console.info("create timeline with informations : ")
    
    const object = <FaunaStruct> JSON.parse(event.body)
    const validStringProperties = ['ownerKey','writeKey','readKey','hash']
    const validProperties = [...validStringProperties, 'timeline']
    const cars64 = /^[0-9a-zA-Z]{64}$/g

    let faunaStruct = new FaunaStruct()

    for (let key in object) {
        if (object.hasOwnProperty(key) && !validProperties.includes(key)) {
            return (new FaunaError(["Malformed Request Body", "key `" + key + "` wasn't expected"]).return())
        }
    }

    let fieldName 
    //Sanitize object
    for (let index in validStringProperties) {
        fieldName = validStringProperties[index]
        if(object[fieldName] && object[fieldName].match(cars64)){ 
            faunaStruct[fieldName] = object[fieldName]
        } else {
            return (new FaunaError(["Malformed Request Body", "key `" + fieldName + "` wasn't well formated"]).return())
        }
    }
    try{
        faunaStruct.timeline = JSON.parse(JSON.stringify(object.timeline), JsonParser.timelineReviver)
    } catch (error){
        return (new FaunaError(["Malformed Request Body", error]).return())
    }
    

    return await client.query(
        //TODO Db stuff
        "done"

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