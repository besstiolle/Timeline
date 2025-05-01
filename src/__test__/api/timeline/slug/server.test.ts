import { afterEach, beforeEach, expectTypeOf, beforeAll, describe, expect, it, vi, test as base } from 'vitest'

import { initDatabase } from '$lib/database/initdatabase';
import Database from 'better-sqlite3';
import { Struct } from '$lib/struct.class';
import { RequestEventStub } from '../../apiUtils';
import * as handlers from '../../../../routes/api/timeline/[slug]/+server';
import { insertTimeline } from '../../../../routes/api/timeline/repository';

const ENTRYPOINT = 'https://dummyEntrypoint.io/api/timeline/'
const HEADER_ACCESS_CONTROL_ALLOW_METHOD = 'Access-Control-Allow-Methods'
const HEADER_ALLOW = 'allow'

const SLUG_OK = '64CarForKey00000000000000000000000000000000000000000000000000000'
const FAKE_KEY = 'WrongKey64Car000000000000000000000000000000000000000000000000000'

const OWNER_OK = '64CarForOwnerKey000000000000000000000000000000000000000000000000'
const WRITE_OK = '64CarForWriteKey000000000000000000000000000000000000000000000000'
const READ_OK = '64CarForReadKey0000000000000000000000000000000000000000000000000'

// @ts-ignore
let db:Database;

beforeEach(() => {
  db = new Database(':memory:')
  //Initiate the internal structur of database
  initDatabase(db)

  //Mock console.error() to avoid vi console pollution
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

const HEADER_CONTENT_TYPE = 'Content-Type'
const HEADER_CONTENT_TYPE_APPJSON = 'application/json'
const HEADER_CONTENT_TYPE_APPPBJSON = 'application/problem+json'


function insert(){
  //Insert directly in database a timeline
  let timeline = new Struct.Timeline()
  timeline.key = SLUG_OK
  timeline.ownerKey = OWNER_OK
  timeline.writeKey = WRITE_OK
  timeline.readKey = READ_OK
  insertTimeline(db,timeline)
}

describe('API /api/timeline with OPTIONS & denied method', () => {

    it('OPTIONS should return 204', async () => {
      const event = new RequestEventStub('OPTIONS', ENTRYPOINT);
      const response = await handlers.OPTIONS(event as any);
  
      expect(response.status).toBe(204);
      expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);

      expect(response.headers.get(HEADER_ACCESS_CONTROL_ALLOW_METHOD)).toBe('GET, DELETE, OPTIONS')
      expect(response.headers.get(HEADER_ALLOW)).toBe('GET, DELETE, OPTIONS')
  
      const text = await response.text();
      expect(text).toBe('')

    });
    

  it('fallback should return 405', async () => {
    const event = new RequestEventStub('POST', ENTRYPOINT);
    const response = await handlers.fallback(event as any);

    expect(response.status).toBe(405);
    expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

    const json = await response.json();
    expect(json.status).toBe(405)
    
  });
});

////////// DELETE

it('DELETE /api/timeline/slug should return 422 if slug dont match pattern', async () => {
  const event = new RequestEventStub('DELETE', ENTRYPOINT+"x",null,db,"x");
  const response = await handlers.DELETE(event as any);

  expect(response.status).toBe(422);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

  const json = await response.json();
  expect(json.status).toBe(422)
})
it('DELETE /api/timeline/slug should return 422 if ownerKey dont match pattern', async () => {
  const event = new RequestEventStub('DELETE', ENTRYPOINT+SLUG_OK+"?ownerKey=x",null,db,SLUG_OK);
  const response = await handlers.DELETE(event as any); 

  expect(response.status).toBe(422);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

  const json = await response.json();
  expect(json.status).toBe(422)
})
it('DELETE /api/timeline/slug should return 404 if slug dont exist', async () => {
  const event = new RequestEventStub('DELETE', ENTRYPOINT+FAKE_KEY+"?ownerKey=" + OWNER_OK,null,db,FAKE_KEY)
  const response = await handlers.DELETE(event as any);
  expect(response.status).toBe(404);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

  const json = await response.json();
  expect(json.status).toBe(404)
})
it('DELETE /api/timeline/slug should return 401 if ownerKey differ from database', async () => {

  //Insert directly in database a timeline
  let timeline = new Struct.Timeline()
  timeline.key = SLUG_OK
  timeline.ownerKey = OWNER_OK
  timeline.writeKey = ''
  timeline.readKey = ''
  insertTimeline(db,timeline)

  const event = new RequestEventStub('DELETE', ENTRYPOINT+SLUG_OK+"?ownerKey="+FAKE_KEY,null,db,SLUG_OK);
  const response = await handlers.DELETE(event as any);

  expect(response.status).toBe(401);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

  const json = await response.json();
  expect(json.status).toBe(401)
})
it('DELETE /api/timeline/slug should return 204 if delete with success', async () => {

  insert()

  const event = new RequestEventStub('DELETE', ENTRYPOINT+SLUG_OK+"?ownerKey=" + OWNER_OK,null,db,SLUG_OK);
  const response = await handlers.DELETE(event as any);

  expect(response.status).toBe(204);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);
  expect(await response.text()).toBe('')  
})

////////// GET


it('GET /api/timeline/slug should return 422 if slug dont match pattern', async () => {
  const event = new RequestEventStub('GET', ENTRYPOINT+"x",null,db,"x");
  const response = await handlers.GET(event as any);

  expect(response.status).toBe(422);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

  const json = await response.json();
  expect(json.status).toBe(422)
})
it('GET /api/timeline/slug should return 422 if ownerKey dont match pattern', async () => {
  const event = new RequestEventStub('GET', ENTRYPOINT+SLUG_OK+"?ownerKey=x",null,db,SLUG_OK);
  const response = await handlers.GET(event as any); 

  expect(response.status).toBe(422);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

  const json = await response.json();
  expect(json.status).toBe(422)
})
it('GET /api/timeline/slug should return 422 if writeKey dont match pattern', async () => {
  const event = new RequestEventStub('GET', ENTRYPOINT+SLUG_OK+"?writeKey=x",null,db,SLUG_OK);
  const response = await handlers.GET(event as any); 

  expect(response.status).toBe(422);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

  const json = await response.json();
  expect(json.status).toBe(422)
})
it('GET /api/timeline/slug should return 422 if readKey dont match pattern', async () => {

  const event = new RequestEventStub('GET', ENTRYPOINT+SLUG_OK+"?readKey=x",null,db,SLUG_OK);
  const response = await handlers.GET(event as any); 

  expect(response.status).toBe(422);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

  const json = await response.json();
  expect(json.status).toBe(422)
})
it('GET /api/timeline/slug should return 404 if slug dont exist', async () => {
  const event = new RequestEventStub('GET', ENTRYPOINT+FAKE_KEY+"?ownerKey=" + OWNER_OK,null,db,FAKE_KEY);
  const response = await handlers.GET(event as any);
  expect(response.status).toBe(404);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

  const json = await response.json();
  expect(json.status).toBe(404)
})
it('GET /api/timeline/slug should return 401 if ownerKey differ from database', async () => {
  insert()
  const event = new RequestEventStub('GET', ENTRYPOINT+SLUG_OK+"?ownerKey="+FAKE_KEY,null,db,SLUG_OK);
  const response = await handlers.GET(event as any);

  expect(response.status).toBe(401);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

  const json = await response.json();
  expect(json.status).toBe(401)
})
it('GET /api/timeline/slug should return 401 if writeKey differ from database', async () => {
  insert()
  const event = new RequestEventStub('GET', ENTRYPOINT+SLUG_OK+"?writeKey="+FAKE_KEY,null,db,SLUG_OK);
  const response = await handlers.GET(event as any);

  expect(response.status).toBe(401);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

  const json = await response.json();
  expect(json.status).toBe(401)
})
it('GET /api/timeline/slug should return 401 if readKey differ from database', async () => {
  insert()
  const event = new RequestEventStub('GET', ENTRYPOINT+SLUG_OK+"?readKey="+FAKE_KEY,null,db,SLUG_OK);
  const response = await handlers.GET(event as any);

  expect(response.status).toBe(401);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

  const json = await response.json();
  expect(json.status).toBe(401)
})
it('GET /api/timeline/slug should return 200 if timeline found with success with ownerKey', async () => {
  let event;
  let response;

  insert()

  //With OwnerKey
  event = new RequestEventStub('GET', ENTRYPOINT+SLUG_OK+"?ownerKey=" + OWNER_OK,null,db,SLUG_OK);
  response = await handlers.GET(event as any);

  expect(response.status).toBe(200);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);

  //Test all key
  let json = await response.json();
  expect(json.data.key).toBe(SLUG_OK)
  expect(json.data.ownerKey).toBe(OWNER_OK)
  expect(json.data.writeKey).toBe(WRITE_OK)
  expect(json.data.readKey).toBe(READ_OK)
})
it('GET /api/timeline/slug should return 200 if timeline found with success with writeKey', async () => {
  let event;
  let response;

  insert()

  event = new RequestEventStub('GET', ENTRYPOINT+SLUG_OK+"?writeKey="+WRITE_OK,null,db,SLUG_OK);
  response = await handlers.GET(event as any);

  expect(response.status).toBe(200);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);

  //Test all key
  let json = await response.json();
  expect(json.data.key).toBe(SLUG_OK)
  expect(json.data.ownerKey).toBeNull()
  expect(json.data.writeKey).toBe(WRITE_OK)
  expect(json.data.readKey).toBe(READ_OK)
})
it('GET /api/timeline/slug should return 200 if timeline found with success with readKey', async () => {
  let event;
  let response;

  insert()

  event = new RequestEventStub('GET', ENTRYPOINT+SLUG_OK+"?readKey="+READ_OK,null,db,SLUG_OK);
  response = await handlers.GET(event as any);

  expect(response.status).toBe(200);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);

  //Test all key
  let json = await response.json();
  expect(json.data.key).toBe(SLUG_OK)
  expect(json.data.ownerKey).toBeNull()
  expect(json.data.writeKey).toBeNull()
  expect(json.data.readKey).toBe(READ_OK)
})