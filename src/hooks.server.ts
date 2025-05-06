import { initDatabase } from '$lib/database/initdatabase';
import type { Handle } from '@sveltejs/kit';
import Database from 'better-sqlite3';
import fs from 'fs';
import { paraglideMiddleware } from './paraglide/server';

const directory = 'db'
export const handle: Handle = async ({ event, resolve }) => {
  //Create database
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
  // --- Middleware Paraglide ---
  const response = await paraglideMiddleware(event.request, async ({ request: localizedRequest, locale }) => {
    event.request = localizedRequest;

    return resolve(event, {
      transformPageChunk: ({ html }) => html.replace('%lang%', locale)
    });
  });
  return response;
};
