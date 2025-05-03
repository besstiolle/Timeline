import { initDatabase } from '$lib/database/initdatabase';
import type { Handle } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import fs from 'fs';

const directory = 'db'
export const handle: Handle = async ({ event, resolve }) => {
  if (!event.locals.db) {

    //Create directory
    if( !fs.existsSync(directory)){
      fs.mkdirSync(directory) 
    }

    // This will create the database within the `db.sqlite` file.
    const db = new Database(`${directory}/db.sqlite`)
    
    db.pragma('journal_mode = WAL');

    // Set the db as our events.db variable.
    event.locals.db = db

    //Initiate the internal structur of database
    initDatabase(db)

  }
  const resp = await resolve(event);
  return resp;
};