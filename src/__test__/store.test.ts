
import '@testing-library/jest-dom'

import { Struct } from '$lib/struct.class';
import { store } from '$lib/stores';
import { get } from 'svelte/store';


jest.mock('$app/env', () => ({
  default: {
      browser: true,
    },
}))

jest.mock('$lib/stores', () => {return jest.requireActual('./mockedstores')})


let timelineStore = new Struct.TimelineStore()
timelineStore.currentTimeline = new Struct.Timeline("key", "title")
timelineStore.currentTimeline.start = "2020-01-01"
timelineStore.currentTimeline.end = "2020-12-31"
timelineStore.currentTimeline.viewbox = "0 0 10 20"

store.set(timelineStore)

test('test Mocked Store', () => {

  expect(get(store).currentTimeline.title).toBe("title")
  expect(get(store).currentTimeline.start).toBe("2020-01-01")
  expect(get(store).currentTimeline.end).toBe("2020-12-31")
  expect(get(store).currentTimeline.viewbox).toBe("0 0 10 20")
  
})