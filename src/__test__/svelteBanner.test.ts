
import '@testing-library/jest-dom'

import {render, fireEvent, within} from '@testing-library/svelte'

import Banner from '$lib/Banner.svelte'
import { Struct } from '$lib/struct.class';
import { store } from '$lib/stores';
import { DIFF, MONTHS } from '$lib/constantes';


jest.mock('$app/environment', () => ({
  default: {
      browser: true,
    },
}))

jest.mock('$lib/stores', () => {return jest.requireActual('./mockedStores')})

let timelineStore = new Struct.TimelineStore()
timelineStore.currentTimeline = new Struct.Timeline("key", "title")
timelineStore.currentTimeline.start = "2019-12-01"
timelineStore.currentTimeline.end = "2021-12-01"
timelineStore.currentTimeline.viewbox = "0 0 10 20"
timelineStore.currentTimeline.differencial = DIFF.isBetween20MonthsAnd3Years

store.set(timelineStore)

test('shows proper heading when rendered', () => {

  const { container, debug }  = render(Banner/*, {name: 'World'}*/)
  const resultsSvelte = container.querySelector('[data-testid="Banner.svelte"]'); 
  expect(resultsSvelte).toHaveAttribute('viewBox', '0 0 10 20'); 

  const resultsJalonTextStart = container.querySelector('[data-testid="jalonText_0"]'); 
  expect(resultsJalonTextStart).toBeDefined()
  expect(resultsJalonTextStart.innerHTML).toBe(MONTHS[11]) //December
    
  const resultsJalonTextNewYear = container.querySelector('[data-testid="jalonText_1"]'); 
  expect(resultsJalonTextNewYear).toBeDefined()
  expect(resultsJalonTextNewYear.innerHTML).toBe(MONTHS[1]) // M+2 : Feb.
  
  const resultsJalonTextEnd = container.querySelector('[data-testid="jalonText_12"]'); 
  expect(resultsJalonTextEnd).toBeDefined()
  expect(resultsJalonTextEnd.innerHTML).toBe(MONTHS[11])
  
  //  const {getByTestId} = render(Banner/*, {name: 'World'}*/)
  //  expect(getByTestId('Banner.svelte')).toBeInTheDocument()
  //  expect(getByTestId('Banner.svelte')).toHaveProperty('viewBox')

  //  const results = render(Banner/*, {name: 'World'}*/)
  //  expect(() => results.getByTestId('Banner.svelte')).not.toThrow()
    //expect(() => results.getByTestId('Banner.svelte')).toBeInTheDocument()
  //  expect(() => results.getByTestId('Banner.svelte')).toHaveProperty('viewBox')
  //  expect(() => results.getByTestId('Banner.svelte')).toHaveProperty('viewBox', '0 0 1 2')
})

//const results = render(Banner/*, { props: { label: 'a button' } }*/);
//expect(() => results.getByLabelText('a button')).not.toThrow();
  