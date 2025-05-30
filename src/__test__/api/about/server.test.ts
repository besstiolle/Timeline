import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RequestEventStub, toRequestEvent } from '../apiUtils';
import { OPTIONS } from '../../../routes/api/about/+server';
import * as handlers from '../../../routes/api/about/+server';
import { GET } from '../../../routes/api/about/+server';


const ENTRYPOINT = 'https://dummyEntrypoint.io/api/about'
const HEADER_ACCESS_CONTROL_ALLOW_METHOD = 'Access-Control-Allow-Methods'
const HEADER_CONTENT_TYPE_APPPBJSON = 'application/problem+json'
const HEADER_ALLOW = 'allow'

beforeEach(() => {
  //Mock console.error() to avoid vi console pollution
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

const HEADER_CONTENT_TYPE = 'Content-Type'
const HEADER_CONTENT_TYPE_APPJSON = 'application/json'


describe('API /api/about with OPTIONS & denied method', () => {

  it('OPTIONS should return 204', async () => {
    const event = new RequestEventStub('OPTIONS', ENTRYPOINT);
    const response = await OPTIONS(toRequestEvent(event));

    expect(response.status).toBe(204);
    expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);

    expect(response.headers.get(HEADER_ACCESS_CONTROL_ALLOW_METHOD)).toBe('GET, OPTIONS')
    expect(response.headers.get(HEADER_ALLOW)).toBe('GET, OPTIONS')

    const text = await response.text();
    expect(text).toBe('')

  });

  it('fallback should return 405', async () => {
    const event = new RequestEventStub('POST', ENTRYPOINT);
    const response = await handlers.fallback(toRequestEvent(event));

    expect(response.status).toBe(405);
    expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPPBJSON);

    const json = await response.json();
    expect(json.status).toBe(405)
    
  });
});

it('GET /api/about should return a ResponseWithMeta JSON ', async () => {
  const event = new RequestEventStub('GET', ENTRYPOINT);
  const response = await GET(toRequestEvent(event));

  expect(response.status).toBe(200);
  expect(response.headers.get(HEADER_CONTENT_TYPE)).toContain(HEADER_CONTENT_TYPE_APPJSON);
  const json = await response.json()
  expect(json.data).not.toBeFalsy()
  expect(json.meta).not.toBeFalsy()
  expect(json.meta.ts).not.toBeFalsy()

  // Test AboutVersion fields
  expect(json.data.version).not.toBeFalsy()
})

