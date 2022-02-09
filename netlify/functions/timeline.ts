// Require the driver
import faunadb from "faunadb"
import {get} from "../timelineGet"
import {create} from "../timelineCreate"
import {remove} from "../timelineDelete"
import {HTTP_WORDS} from "../faunaConstantes"


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
exports.handler = async function (event, context) {
    
    const q = faunadb.query    
    const secret = process.env.FAUNADB_SECRET
    const endpoint = process.env.FAUNADB_ENDPOINT
    
    if (typeof secret === 'undefined' || secret === '') {
      console.error('The FAUNADB_SECRET environment variable is not set, exiting.')
      process.exit(1)
    }
    
    const client = new faunadb.Client({
      secret: secret,
      domain: endpoint,
      port: 443,
      scheme: 'https',
    })

    switch (event.httpMethod) {
      
      case HTTP_WORDS.GET:    return get(   q, client, event, context)
      case HTTP_WORDS.POST:   return create(q, client, event, context)
      case HTTP_WORDS.DELETE: return remove(q, client, event, context)
      
      case HTTP_WORDS.OPTIONS: 
        return {
          statusCode: 200,
          body: JSON.stringify({}, null, 2),
        }

      default:
        return {
          statusCode: 405,
          body: JSON.stringify({message: `Method ${event.httpMethod} Not Allowed`}, null, 2)
        }
    } 

};