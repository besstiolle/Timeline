import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/svelte';

import Banner from '$lib/components/Banner/Banner.svelte';
import { MONTHS } from '$lib/constantes';
import { Rights } from '$lib/rights.class';
import { Task, Timeline} from '$lib/struct.class.svelte';
import { appState } from '$lib/state/appState.svelte';
import { volatileAppState } from '$lib/state/volatileAppState.svelte';

vi.mock('$app/environment', async (importOriginal) => {
	const actual = await importOriginal<typeof import('$app/environment')>();
    return {
        ...actual,
        browser: true
    };
});

describe('test Rendering', () => {


	appState.currentTimeline = new Timeline('key', 'title')
	appState.currentTimeline.tasks.push(new Task(1, 'label 1', '2020-01-01', '2020-12-31', true, 100, true, 'Swimline 1'))
	appState.rights = new Rights()
	volatileAppState.lastCommitedRemotely = -1
	volatileAppState.lastUpdatedLocally = -1
	volatileAppState._cancelRefreshLastUpdatedLocally = false

	it('viexbox must be 0 0 1000 115', () => {
		const { container } = render(Banner /*, {name: 'World'}*/);
		const resultsSvelte = container.querySelector('[data-testid="Banner.svelte"]');
		expect((resultsSvelte as SVGSVGElement).getAttribute('viewBox')).toBe('0 0 1000 145'); //(115 + 30 * task)
	});

	it('must be december on Jalon#0', () => {
		const { container } = render(Banner /*, {name: 'World'}*/);
		const resultsJalonTextStart = container.querySelector('[data-testid="jalonText_0"]');
		expect(resultsJalonTextStart).toBeDefined();
		expect(resultsJalonTextStart).not.toBeNull();
		expect((resultsJalonTextStart as HTMLElement).innerHTML).toBe(MONTHS[11]); //December
	});

	it('must be new year on Jalon#1', () => {
		const { container } = render(Banner /*, {name: 'World'}*/);
		const resultsJalonTextNewYear = container.querySelector('[data-testid="jalonText_1"]');
		expect(resultsJalonTextNewYear).toBeDefined();
		expect(resultsJalonTextNewYear).not.toBeNull();
		expect((resultsJalonTextNewYear as HTMLElement).innerHTML).toBe('2020'); // M+1 : new Year.
	});

	it('must be March on Jalon#15', () => {
		const { container } = render(Banner /*, {name: 'World'}*/);
		const resultsJalonTextEnd = container.querySelector('[data-testid="jalonText_15"]');
		expect(resultsJalonTextEnd).toBeDefined();
		expect(resultsJalonTextEnd).not.toBeNull();
		expect((resultsJalonTextEnd as HTMLElement).innerHTML).toBe(MONTHS[2]); // March
	});

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
});
