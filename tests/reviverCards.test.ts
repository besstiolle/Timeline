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

describe('test Filtering by Full Text', () => {
	 it('JsonParser.cardsReplacer with cards values', () => {
		reset();

		const jsonResult = JSON.stringify(appState.cards);
		const jsonExpected = '[]';
		expect(jsonResult).toBe(jsonExpected);
	});

	it('JsonParser.cardsReplacer with cards values', () => {
		reset();

		const jsonResult = JSON.stringify(appState.cards);
		const jsonExpected = '[]';
		expect(jsonResult).toBe(jsonExpected);
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

		const jsonResult = JSON.stringify(appState.cards);
		const jsonExpected = JSON.stringify(reviverCards_withCards);

		expect(jsonResult).toBe(jsonExpected);
	});
 
	it('JsonParser.cardsReviver with cards values', () => {
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

		const jsonResult = JSON.stringify(appState.cards);

		const object = JSON.parse(jsonResult, JsonParser.cardsReviver);
		expect(object.constructor.name).toEqual('Array');
		expect((<Array<Card>>object).length).toBe(3);
		expect((<Array<Card>>object)[0].key).toBe('key1');
		expect((<Array<Card>>object)[0].title).toBe('title1');
		expect((<Array<Card>>object)[0].lastUpdated).toEqual(new Date('2020-12-31'));
	});

	//Won't throw exception since we force toJson() into struct.class.svelte.ts
	it('JsonParser.cardsReviver with unknow values', () => {
		reset();
		// @ts-expect-error forcing error for testing porpose
		appState['unknowKey'] = 'bar';

		const jsonResult = JSON.stringify(appState.cards);

		expect(() => {
			JSON.parse(jsonResult, JsonParser.cardsReviver);
		}).not.toThrow(JsonParserException);
	}); 
});
