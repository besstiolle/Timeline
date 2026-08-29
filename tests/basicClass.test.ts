import { describe, expect, it, vi } from 'vitest';
import { JsonParser } from '$lib/jsonParser';
import { JsonParserException } from '$lib/timelineException.class';
import { Rights } from '$lib/rights.class';
import reviverCards_withCards from './json/reviverCards_withCards.json';
import { Card, Timeline } from '$lib/struct.class.svelte';
import { appState } from '$lib/state/appState.svelte';

//Mock console.error() to avoid vi console pollution
vi.spyOn(console, 'error').mockImplementation(() => {});

const reset = ()=>{
	appState.cards = []
	appState.currentTimeline = new Timeline()
	appState.rights = new Rights()
}

describe('test class & appState', () => {
	
	it('test class & appState', () => {
		reset();
		const card1 = new Card('key1', 'title1');

		expect(card1.key).toBe('key1')
	});
	it('test class & appState', () => {
		reset();
		const card1 = new Card('key1', 'title1');
		card1.lastUpdated = new Date('2020-12-31')
		expect(card1.key).toBe('key1')

		appState.cards.push(card1)
		expect(appState.cards[0].key).toBe('key1')
		expect(appState.cards[0].lastUpdated).toStrictEqual(new Date('2020-12-31'))
	});
	it('test class & appState', () => {
		reset();
		const card1 = new Card('key1', 'title1');
		card1.lastUpdated = new Date('2020-12-31')
		expect(card1.key).toBe('key1')

		appState.cards.push(card1)
		expect(appState.cards[0].key).toBe('key1')
		expect(appState.cards[0].lastUpdated).toStrictEqual(new Date('2020-12-31'))
	});
	it('JsonParser.cardsReplacer with cards values', () => {
		reset();
		const card1 = new Card('key1', 'title1');
		card1.lastUpdated = new Date('2020-12-31');
		const card2 = new Card('key2', 'title2');
		card2.lastUpdated = new Date('2022-01-01');
		const card3 = new Card('key3', 'title3');
		card3.lastUpdated = new Date('2021-02-01');
		appState.cards.push(card1);
		appState.cards.push(card2);
		appState.cards.push(card3);

		expect(appState.cards[0].key).toBe('key1')
		expect(appState.cards[0].lastUpdated).toStrictEqual(new Date('2020-12-31'))
		expect(appState.cards.length).toBe(3)

		//console.info(typeof(appState.cards as Card[]))

 		const jsonResult = JSON.stringify(appState.cards);
		const jsonExpected = JSON.stringify(reviverCards_withCards);

		expect(jsonResult).toBe(jsonExpected);
	});
});
