// Require the driver
import faunadb from "faunadb"
import { FaunaError } from "../FaunaError";

exports.handler = async function () {
    
    const q = faunadb.query

    let foo_secret = process.env.FOO_SECRET
    
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

    await client.query(
      q.CreateCollection({ name: 'myCollection_' + Math.floor(Math.random() * 100) })
    ).then((ret) => {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'ret : ' + ret }),
      }
      
    })
    .catch((err) => {
      return (new FaunaError(err)).return()
    })
  };