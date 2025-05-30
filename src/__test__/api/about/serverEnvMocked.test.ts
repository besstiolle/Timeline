import { beforeEach,  expect, it, vi } from 'vitest'
import { RequestEventStub, toRequestEvent } from '../apiUtils';


const ENTRYPOINT = 'https://dummyEntrypoint.io/api/about'


beforeEach(() => {
  //Mock console.error() to avoid vi console pollution
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

const HEADER_CONTENT_TYPE = 'Content-Type'
const HEADER_CONTENT_TYPE_APPJSON = 'application/json'


it('GET /api/about should return a ResponseWithMeta JSON with no version if we change ENV VAR to false', async () => {
  
  vi.doMock('$env/dynamic/private', () => ({
    env:{SHOW_VERSION: 'false'}
  }));

  const { env } = await import ('$env/dynamic/private')

  expect(env.SHOW_VERSION).toBe('false');
  
  const { GET } = await import('../../../routes/api/about/+server');

  const event = new RequestEventStub('GET', ENTRYPOINT);
  const response = await GET(toRequestEvent(event));

  expect(response.status).toBe(200);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);
  const json = await response.json()
  expect(json.data).not.toBeFalsy()
  expect(json.meta).not.toBeFalsy()
  expect(json.meta.ts).not.toBeFalsy()

  // Test AboutVersion fields
  expect(json.data.version).toBe('')


  vi.resetModules(); // nettoie les effets du mock pour les autres tests
})

it('GET /api/about should return a ResponseWithMeta JSON with no version if we change ENV VAR to undefined', async () => {
  
  vi.doMock('$env/dynamic/private', () => ({
    env:{SHOW_VERSION: undefined}
  }));

  const { env } = await import ('$env/dynamic/private')

  expect(env.SHOW_VERSION).toBe(undefined);
  
  const { GET } = await import('../../../routes/api/about/+server');

  const event = new RequestEventStub('GET', ENTRYPOINT);
  const response = await GET(toRequestEvent(event));

  expect(response.status).toBe(200);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);
  const json = await response.json()
  expect(json.data).not.toBeFalsy()
  expect(json.meta).not.toBeFalsy()
  expect(json.meta.ts).not.toBeFalsy()

  // Test AboutVersion fields
  expect(json.data.version).toBe('')


  vi.resetModules(); // nettoie les effets du mock pour les autres tests
})

it('GET /api/about should return a ResponseWithMeta JSON with no version if we change ENV VAR to empty', async () => {
  
  vi.doMock('$env/dynamic/private', () => ({
    env:{}
  }));

  const { env } = await import ('$env/dynamic/private')

  expect(env.SHOW_VERSION).toBe(undefined);
  
  const { GET } = await import('../../../routes/api/about/+server');

  const event = new RequestEventStub('GET', ENTRYPOINT);
  const response = await GET(toRequestEvent(event));

  expect(response.status).toBe(200);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);
  const json = await response.json()
  expect(json.data).not.toBeFalsy()
  expect(json.meta).not.toBeFalsy()
  expect(json.meta.ts).not.toBeFalsy()

  // Test AboutVersion fields
  expect(json.data.version).toBe('')


  vi.resetModules(); // nettoie les effets du mock pour les autres tests
})

