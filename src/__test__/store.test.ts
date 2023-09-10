import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Struct } from '$lib/struct.class';
import { store } from '$lib/stores';
import { get } from 'svelte/store';


describe('test Mocked Store', () => {
    vi.mock('$app/environment', () => ({
      default: {
          browser: true,
        },
    }))

    vi.mock('$lib/stores', () => {return vi.importActual('./mockedStores')})
  

    it('Updating store should return udated values', () => {
      let timelineStore = new Struct.TimelineStore()
      timelineStore.currentTimeline = new Struct.Timeline("key", "title")
      timelineStore.currentTimeline.start = "2020-01-01"
      timelineStore.currentTimeline.end = "2020-12-31"
      timelineStore.currentTimeline.viewbox = "0 0 10 20"
      
      store.set(timelineStore)
        
        expect(get(store).currentTimeline.title).toBe("title")
        expect(get(store).currentTimeline.start).toBe("2020-01-01")
        expect(get(store).currentTimeline.end).toBe("2020-12-31")
        expect(get(store).currentTimeline.viewbox).toBe("0 0 10 20")
    })
})
