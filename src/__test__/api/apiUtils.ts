import { JsonParser } from '$lib/jsonParser';
import type { Timeline } from '$lib/struct.class';
import type { RequestEvent } from '@sveltejs/kit';
import type { drizzle } from 'drizzle-orm/better-sqlite3';

export class RequestEventStub {
	request: Request;
	params: Record<string, unknown> = {};
	locals: Record<string, unknown> = {};
	url: URL;
	slug: string;

	constructor(
		method: string,
		url: string,
		body?: string | null,
		db?: ReturnType<typeof drizzle>,
		slug?: string | null
	) {
		const inner_url = new URL(url);
		// console.info(method, inner_url.toString(),inner_url.searchParams.get('ownerKey'))
		this.request = new Request(new URL(url), { method: method, body: body });

		this.params.slug = slug;
		this.locals.db = db;
		this.locals.startTimer = Date.now();
		this.url = inner_url;
		this.slug = 'no_slug';
	}
}

/**
 * An utils function to avoid hugly code in test files
 * @param request the RequestEventStub
 * @returns the RequestEvent for testing only
 */
export function toRequestEvent(request: RequestEventStub): RequestEvent {
	return request as unknown as RequestEvent;
}

export const VALID_DUMMY_TIMELINE: Timeline = JSON.parse(
	`{
  "key": "64CarForKey00000000000000000000000000000000000000000000000000000",
  "title": "My new Project",
  "tasks": [
    {
      "id": 0,
      "label": "Random Task 0",
      "dateStart": "2021-01-15",
      "dateEnd": "2021-04-01",
      "hasProgress": true,
      "progress": 100,
      "isShow": true,
      "swimline": "",
      "swimlineId": -1
    },
    {
      "id": 1,
      "label": "Random Task 1",
      "dateStart": "2021-12-01",
      "dateEnd": "2022-04-01",
      "hasProgress": false,
      "progress": 0,
      "isShow": true,
      "swimline": "",
      "swimlineId": -1
    },
    {
      "id": 2,
      "label": "Random Task 2",
      "dateStart": "2021-02-01",
      "dateEnd": "2021-03-05",
      "hasProgress": true,
      "progress": 15,
      "isShow": true,
      "swimline": "Swimline1",
      "swimlineId": 0
    },
    {
      "id": 3,
      "label": "Random Task 3",
      "dateStart": "2021-03-10",
      "dateEnd": "2021-03-30",
      "hasProgress": true,
      "progress": 0,
      "isShow": true,
      "swimline": "Swimline1",
      "swimlineId": 0
    },
    {
      "id": 4,
      "label": "Random Task 4",
      "dateStart": "2021-02-01",
      "dateEnd": "2021-05-01",
      "hasProgress": true,
      "progress": 30,
      "isShow": false,
      "swimline": "",
      "swimlineId": -1
    },
    {
      "id": 5,
      "label": "Random Task 5",
      "dateStart": "2021-01-31",
      "dateEnd": "2021-03-01",
      "hasProgress": true,
      "progress": 100,
      "isShow": true,
      "swimline": "",
      "swimlineId": -1
    },
    {
      "id": 6,
      "label": "Random Task 6",
      "dateStart": "2021-05-01",
      "dateEnd": "2021-05-05",
      "hasProgress": true,
      "progress": 25,
      "isShow": true,
      "swimline": "Swimline2",
      "swimlineId": 1
    },
    {
      "id": 7,
      "label": "Random Task 7",
      "dateStart": "2021-12-01",
      "dateEnd": "2022-04-01",
      "hasProgress": true,
      "progress": 75,
      "isShow": true,
      "swimline": "",
      "swimlineId": -1
    }
  ],
  "milestones": [
    {
      "id": 8,
      "label": "Milestone 1",
      "date": "2020-12-01",
      "isShow": true
    },
    {
      "id": 9,
      "label": "Milestone 2",
      "date": "2021-03-20",
      "isShow": true
    },
    {
      "id": 10,
      "label": "Milestone 3",
      "date": "2022-08-15",
      "isShow": false
    }
  ],
  "swimlines": [
    {
      "label": "Swimline1",
      "countVisibleTasks": 2,
      "countAllTasks": 2,
      "isShow": true
    },
    {
      "label": "Swimline2",
      "countVisibleTasks": 1,
      "countAllTasks": 1,
      "isShow": true
    }
  ],
  "isInitiate": true,
  "start": "2020-11-01",
  "end": "2022-09-01",
  "differencial": "isBetween20MonthsAnd3Years",
  "maxId": 11,
  "viewbox": "0 0 1000 355",
  "showAll": true,
  "isOnline": true,
  "ownerKey": "64CarForOwnerKey000000000000000000000000000000000000000000000000",
  "writeKey": "64CarForWriteKey000000000000000000000000000000000000000000000000",
  "readKey": "64CarForReadKey0000000000000000000000000000000000000000000000000",
  "showToday": true,
  "showOutOfBounds": true,
  "dateStartFocus": null,
  "dateEndFocus": null
}`,
	JsonParser.timelineReviver
);
