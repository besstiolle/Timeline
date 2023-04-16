import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from "@testing-library/svelte";

import Banner from '$lib/Banner.svelte'
import { Struct } from '$lib/struct.class';
import { store } from '$lib/stores';
import { DIFF, MONTHS } from '$lib/constantes';


vi.mock('$app/environment', () => ({
  default: {
      browser: true,
    },
}))

vi.mock('$lib/stores', () => {return vi.importActual('./mockedStores')})

describe('test Rendering', () => {

    let timelineStore = new Struct.TimelineStore()
    timelineStore.currentTimeline = new Struct.Timeline("key", "title")
    timelineStore.currentTimeline.start = "2019-12-01"
    timelineStore.currentTimeline.end = "2021-12-01"
    timelineStore.currentTimeline.viewbox = "0 0 10 20"
    timelineStore.currentTimeline.differencial = DIFF.isBetween20MonthsAnd3Years

    store.set(timelineStore) 

    it('viexbox must be 0 0 10 20', () => {
      const { container, debug }  = render(Banner/*, {name: 'World'}*/)
      const resultsSvelte = container.querySelector('[data-testid="Banner.svelte"]'); 
      expect((resultsSvelte as SVGSVGElement).getAttribute('viewBox')).toBe('0 0 10 20');
    })

    it('must be October on Jalon#0', () => {
      const { container, debug }  = render(Banner/*, {name: 'World'}*/)
      const resultsJalonTextStart = container.querySelector('[data-testid="jalonText_0"]'); 
      expect(resultsJalonTextStart).toBeDefined()
      expect(resultsJalonTextStart).not.toBeNull()
      expect((resultsJalonTextStart as HTMLElement).innerHTML).toBe(MONTHS[11]) //December
    })

    it('must be October on Jalon#1', () => {
      const { container, debug }  = render(Banner/*, {name: 'World'}*/) 
      const resultsJalonTextNewYear = container.querySelector('[data-testid="jalonText_1"]'); 
      expect(resultsJalonTextNewYear).toBeDefined()
      expect(resultsJalonTextNewYear).not.toBeNull()      
      expect((resultsJalonTextNewYear as HTMLElement).innerHTML).toBe(MONTHS[1]) // M+2 : Feb.
    })

    it('must be October on Jalon#12', () => {
      const { container, debug }  = render(Banner/*, {name: 'World'}*/)
      const resultsJalonTextEnd = container.querySelector('[data-testid="jalonText_12"]'); 
      expect(resultsJalonTextEnd).toBeDefined()
      expect(resultsJalonTextEnd).not.toBeNull()
      expect((resultsJalonTextEnd as HTMLElement).innerHTML).toBe(MONTHS[11]) // OCtober
    })
          

        
      
      
      //  const {getByTestId} = render(Banner/*, {name: 'World'}*/)
      //  expect(getByTestId('Banner.svelte')).toBeInTheDocument()
      //  expect(getByTestId('Banner.svelte')).toHaveProperty('viewBox')

      //  const results = render(Banner/*, {name: 'World'}*/)
      //  expect(() => results.getByTestId('Banner.svelte')).not.toThrow()
        //expect(() => results.getByTestId('Banner.svelte')).toBeInTheDocument()
      //  expect(() => results.getByTestId('Banner.svelte')).toHaveProperty('viewBox')
      //  expect(() => results.getByTestId('Banner.svelte')).toHaveProperty('viewBox', '0 0 1 2') 

    //const results = render(Banner/*, { props: { label: 'a button' } }*/);
    //expect(() => results.getByLabelText('a button')).not.toThrow();
})  
