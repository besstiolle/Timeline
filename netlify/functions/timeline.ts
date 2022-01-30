// Require the driver
import faunadb from "faunadb"
import {get} from "../timelineGet"
import {create} from "../timelineCreate"
import {HTTP_WORDS} from "../../src/faunadb/constantes"


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
    
    const fauna = faunadb.query    
    //const secret = process.env.FAUNADB_SECRET
    //const endpoint = process.env.FAUNADB_ENDPOINT

    const secret = 'fnAEeCNDPFAAwH_FYsk3zaEBQPDXa8adEAdO4Xp2'
    const endpoint = 'db.eu.fauna.com'
    
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
      case HTTP_WORDS.GET: 
        return get(fauna, client, event, context)
    
      case HTTP_WORDS.POST: 
        return create(fauna, client, event, context)
    
      case HTTP_WORDS.DELETE: 
        break;
    
      default:
        break;
    }

    
    //
    //console.log('Function `todo-create` invoked', data)


  //fauna.CreateCollection({ name: 'myCollection'})
  //fauna.Collection( 'myCollection' )
    

};