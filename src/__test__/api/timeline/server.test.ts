import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RequestEventStub, toRequestEvent, VALID_DUMMY_TIMELINE } from '../apiUtils';
import { OPTIONS } from '../../../routes/api/timeline/+server';
import * as handlers from '../../../routes/api/timeline/+server';
import { initDatabase } from '$lib/database/initdatabase';
import type { ResponseWithMeta } from '../../../routes/api/timeline/types'
import { countTimelineByKey } from '../../../routes/api/timeline/repository';
import Database from 'better-sqlite3';
import type { Timeline } from '$lib/struct.class';

const ENTRYPOINT = 'https://dummyEntrypoint.io/api/timeline'
const HEADER_ACCESS_CONTROL_ALLOW_METHOD = 'Access-Control-Allow-Methods'
const HEADER_ALLOW = 'allow'
const FAKE_KEY = 'WrongKey64Car000000000000000000000000000000000000000000000000000'

// @ts-expect-error TODO find a workaround as Database is a namespace
let db:Database

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

  /*
const test = base.extend<{testIntegrityOfKey: (clone: any, expectedStatus: number) => void;}>({
  testIntegrityOfKey: async ({}, use) => {
    await use(async (clone: any, expectedStatus: number) => {
      const event = new RequestEventStub('POST', ENTRYPOINT,JSON.stringify(clone),db);
      const response =  await handlers.POST(toRequestEvent(event)) 
      const json = await response.json()
      expect(response.status).toBe(expectedStatus);
      expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);
      expect(json.status).toBe(expectedStatus)
    });
  }
});*/



  async function testIntegrityOfKey(clone:(string|object), expectedStatus:number){
    const event = new RequestEventStub('POST', ENTRYPOINT,JSON.stringify(clone),db);
    const response = await handlers.POST(toRequestEvent(event));
    const json = await response.json();

    expect(response.status).toBe(expectedStatus);
    expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);
    expect(json.status).toBe(expectedStatus)
  }

describe('API /api/timeline with OPTIONS & denied method', () => {

    it('OPTIONS should return 204', async () => {
      const event = new RequestEventStub('OPTIONS', ENTRYPOINT);
      const response = await OPTIONS(toRequestEvent(event));
  
      expect(response.status).toBe(204);
      expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);

      expect(response.headers.get(HEADER_ACCESS_CONTROL_ALLOW_METHOD)).toBe('POST, OPTIONS')
      expect(response.headers.get(HEADER_ALLOW)).toBe('POST, OPTIONS')
  
      const text = await response.text();
      expect(text).toBe('')

    });
    

  it('fallback should return 405', async () => {
    const event = new RequestEventStub('GET', ENTRYPOINT);
    const response = await handlers.fallback(toRequestEvent(event));

    expect(response.status).toBe(405);
    expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

    const json = await response.json();
    expect(json.status).toBe(405)
    
  });
});



it('POST /api/timeline should return 400 if not having a proper body', async () => {
  const clone = structuredClone(VALID_DUMMY_TIMELINE)
  // @ts-expect-error forcing error for testing porpose
  clone["foo"] = "bar"
  testIntegrityOfKey(clone, 400)
})

it('POST /api/timeline should return 400 if body is an empty JSON', async () => {
  testIntegrityOfKey({}, 400)
})

it('POST /api/timeline should return 400 if not having a body at all', async () => {
  testIntegrityOfKey('', 400)
})


it('POST /api/timeline should return 422 if integrity of slug failed by RegEx', async () => {
  const clone = structuredClone(VALID_DUMMY_TIMELINE)
  // @ts-expect-error forcing error for testing porpose
  clone["key"] = null
  testIntegrityOfKey(clone, 422)
  clone["key"] = ''
  testIntegrityOfKey(clone, 422)
  clone["key"] = '""'
  testIntegrityOfKey(clone, 422)
  clone["key"] = 'shortKey'
  testIntegrityOfKey(clone, 422)
  clone["key"] = "64carWithError____!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  testIntegrityOfKey(clone, 422)
})
it('POST /api/timeline should return 422 if integrity of ownerKey failed by RegEx', async () => {
  const clone = structuredClone(VALID_DUMMY_TIMELINE)
  
  clone["ownerKey"] = null
  testIntegrityOfKey(clone, 401) // During first creation the ownerKey is necessary => 401
  clone["ownerKey"] = ''
  testIntegrityOfKey(clone, 401) // During first creation the ownerKey is necessary => 401
  clone["ownerKey"] = '""'
  testIntegrityOfKey(clone, 422)
  clone["ownerKey"] = 'shortKey'
  testIntegrityOfKey(clone, 422)
  clone["ownerKey"] = "64carWithError****!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  testIntegrityOfKey(clone, 422)
})

it('POST /api/timeline should return 422 if integrity of writeKey failed by RegEx', async () => {
  const clone = structuredClone(VALID_DUMMY_TIMELINE)
  clone["writeKey"] = null
  testIntegrityOfKey(clone, 422)
  clone["writeKey"] = ''
  testIntegrityOfKey(clone, 422)
  clone["writeKey"] = '""'
  testIntegrityOfKey(clone, 422)
  clone["writeKey"] = 'shortKey'
  testIntegrityOfKey(clone, 422)
  clone["writeKey"] = "64carWithError////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  testIntegrityOfKey(clone, 422)
})
it('POST /api/timeline should return 422 if integrity of readKey failed by RegEx', async () => {
  const clone = structuredClone(VALID_DUMMY_TIMELINE)
  clone["readKey"] = null
  testIntegrityOfKey(clone, 422)
  clone["readKey"] = ''
  testIntegrityOfKey(clone, 422)
  clone["readKey"] = '""'
  testIntegrityOfKey(clone, 422)
  clone["readKey"] = 'shortKey'
  testIntegrityOfKey(clone, 422)
  clone["readKey"] = "64carWithError////!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
  testIntegrityOfKey(clone, 422) 
})

it('POST /api/timeline should return 401 if access key are different vs what is already in database failed', async () => {

  let counter = countTimelineByKey(db, VALID_DUMMY_TIMELINE.key)
  expect(counter).toBe(0);

  //a first insertion by owner key: 201
  let clone = structuredClone(VALID_DUMMY_TIMELINE)
  const event = new RequestEventStub('POST', ENTRYPOINT,JSON.stringify(clone),db);
  const response = await handlers.POST(toRequestEvent(event));
  expect(response.status).toBe(201);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);

  counter = countTimelineByKey(db, VALID_DUMMY_TIMELINE.key)
  expect(counter).toBe(1);

  //a second insertion by altered owner key : 401
  clone = structuredClone(VALID_DUMMY_TIMELINE)
  clone.ownerKey = FAKE_KEY
  testIntegrityOfKey(clone, 401)
  expect(counter).toBe(1);

  //a second insertion by altered write key and no owner key : 401
  clone = structuredClone(VALID_DUMMY_TIMELINE) 
  clone.ownerKey = null
  clone.writeKey = FAKE_KEY
  testIntegrityOfKey(clone, 401)
  expect(counter).toBe(1);
})
it('POST /api/timeline with only writeKey should return 401 if there is not already an existing timeline', async () => {
  const clone = structuredClone(VALID_DUMMY_TIMELINE)
  clone["ownerKey"] = null
  testIntegrityOfKey(clone, 401) // During first creation the ownerKey is necessary => 401
})

it('POST /api/timeline should return 201 + json content type created if success', async () => {
  const clone = structuredClone(VALID_DUMMY_TIMELINE) 
  const event = new RequestEventStub('POST', ENTRYPOINT,JSON.stringify(clone),db);
  const response = await handlers.POST(toRequestEvent(event));
  expect(response.status).toBe(201);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);
})

it('POST /api/timeline should return a ResponseWithMeta object if success', async () => {
  const clone = structuredClone(VALID_DUMMY_TIMELINE) 
  const event = new RequestEventStub('POST', ENTRYPOINT,JSON.stringify(clone),db);
  const response = await handlers.POST(toRequestEvent(event));
  const json = await response.json() as unknown as ResponseWithMeta
  expect(json?.meta?.ts).toBeGreaterThan(1745841400000)
  expect(json?.meta?.ts).toBeLessThanOrEqual(Date.now())

  const returnedTimeline = json?.data as Timeline
  expect(returnedTimeline).toStrictEqual(clone)

})
it('POST /api/timeline should return 201 if everything is ok and data must be created inside db', async () => {
  
  let counter = countTimelineByKey(db, VALID_DUMMY_TIMELINE.key)
  expect(counter).toBe(0);

  //a first insertion by owner key: 201
  let clone = structuredClone(VALID_DUMMY_TIMELINE)
  let event = new RequestEventStub('POST', ENTRYPOINT,JSON.stringify(clone),db);
  let response = await handlers.POST(toRequestEvent(event));
  expect(response.status).toBe(201);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);

  counter = countTimelineByKey(db, VALID_DUMMY_TIMELINE.key)
  expect(counter).toBe(1);

  //a second insertion by owner key : 201
  clone = structuredClone(VALID_DUMMY_TIMELINE)
  event = new RequestEventStub('POST', ENTRYPOINT,JSON.stringify(clone),db);
  response = await handlers.POST(toRequestEvent(event));
  expect(response.status).toBe(201);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);

  counter = countTimelineByKey(db, VALID_DUMMY_TIMELINE.key)
  expect(counter).toBe(2);
})

it('POST /api/timeline with only writeKey should return 201 + json if there is already an existing timeline', async () => {
  
  let counter = countTimelineByKey(db, VALID_DUMMY_TIMELINE.key)
  expect(counter).toBe(0);

  //a first insertion by owner key: 201
  let clone = structuredClone(VALID_DUMMY_TIMELINE)
  let event = new RequestEventStub('POST', ENTRYPOINT,JSON.stringify(clone),db);
  let response = await handlers.POST(toRequestEvent(event));
  expect(response.status).toBe(201);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);

  counter = countTimelineByKey(db, VALID_DUMMY_TIMELINE.key)
  expect(counter).toBe(1);

  //a second insertion by write key : 201
  clone = structuredClone(VALID_DUMMY_TIMELINE)
  clone.ownerKey = ''
  event = new RequestEventStub('POST', ENTRYPOINT,JSON.stringify(clone),db);
  response = await handlers.POST(toRequestEvent(event));
  expect(response.status).toBe(201);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);

  counter = countTimelineByKey(db, VALID_DUMMY_TIMELINE.key)
  expect(counter).toBe(2);

})


it('POST /api/timeline with only writeKey should return an object without ownerKey if there is already an existing timeline', async () => {
  //a first insertion by owner key: 201
  let clone = structuredClone(VALID_DUMMY_TIMELINE)
  let event = new RequestEventStub('POST', ENTRYPOINT,JSON.stringify(clone),db);
  let response = await handlers.POST(toRequestEvent(event));
  expect(response.status).toBe(201);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);

  //a second insertion by write key : 201
  clone = structuredClone(VALID_DUMMY_TIMELINE)
  clone.ownerKey = ''
  event = new RequestEventStub('POST', ENTRYPOINT,JSON.stringify(clone),db);
  response = await handlers.POST(toRequestEvent(event));
  expect(response.status).toBe(201);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);
  const json = await response.json()
  expect(json.data.ownerKey).toBe('')
  expect(json.data.writeKey).toBe(clone.writeKey)
  expect(json.data.readKey).toBe(clone.readKey)
})