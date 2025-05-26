

import { describe, expect, it, vi } from 'vitest'
import { JsonParser } from "$lib/jsonParser"
import { Struct } from "$lib/struct.class"
import { JsonParserException } from "$lib/timelineException.class"
import { Rights } from '$lib/rights.class';
import reviverCards_withCards from './json/reviverCards_withCards.json'

//Mock console.error() to avoid vi console pollution
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('test Filtering by Full Text', () => {

    it('JsonParser.cardsReplacer with cards values', () => {
        const timelineStore = new Struct.TimelineStore([], new Struct.Timeline(), new Rights())   
    
        const jsonResult = JSON.stringify(timelineStore.cards)
        const jsonExpected = '[]'
        expect(jsonResult).toBe(jsonExpected)    
    })

    it('JsonParser.cardsReplacer with cards values', () => {
        const timelineStore = new Struct.TimelineStore([], new Struct.Timeline(), new Rights())  
    
        const jsonResult = JSON.stringify(timelineStore.cards)
        const jsonExpected = '[]'
            expect(jsonResult).toBe(jsonExpected)  
    })

    it('JsonParser.cardsReplacer with cards values', () => {
        const timelineStore = new Struct.TimelineStore([], new Struct.Timeline(), new Rights())  
        const card1 = new Struct.Card("key1", "title1") 
        card1.lastUpdated = new Date("2020-12-31")
        const card2 = new Struct.Card("key2", "title2") 
        card2.lastUpdated = new Date("2022-01-01")
        const card3 = new Struct.Card("key3", "title3") 
        card3.lastUpdated = new Date("2021-02-01")
        timelineStore.cards.push(card1)
        timelineStore.cards.push(card2)
        timelineStore.cards.push(card3)
        
        const jsonResult = JSON.stringify(timelineStore.cards)
        const jsonExpected = JSON.stringify(reviverCards_withCards)
    
        expect(jsonResult).toBe(jsonExpected)  
    })

    it('JsonParser.cardsReviver with cards values', () => {
        const timelineStore = new Struct.TimelineStore([], new Struct.Timeline(), new Rights())  
        const card1 = new Struct.Card("key1", "title1") 
        card1.lastUpdated = new Date("2020-12-31")
        const card2 = new Struct.Card("key2", "title2") 
        card2.lastUpdated = new Date("2022-01-01")
        const card3 = new Struct.Card("key3", "title3") 
        card3.lastUpdated = new Date("2021-02-01")
        timelineStore.cards.push(card1)
        timelineStore.cards.push(card2)
        timelineStore.cards.push(card3)
        
        const jsonResult = JSON.stringify(timelineStore.cards)
    
        const object = JSON.parse(jsonResult, JsonParser.cardsReviver)
        expect(object.constructor.name).toEqual("Array")
        expect((<Array<Struct.Card>>object).length).toBe(3)
        expect((<Array<Struct.Card>>object)[0].key).toBe("key1")
        expect((<Array<Struct.Card>>object)[0].title).toBe("title1")
        expect((<Array<Struct.Card>>object)[0].lastUpdated).toEqual(new Date("2020-12-31"))
    })

    it('JsonParser.cardsReviver with unknow values', () => {
        const timelineStore = new Struct.TimelineStore([], new Struct.Timeline(), new Rights())  
        // @ts-expect-error forcing error for testing porpose
        timelineStore['unknowKey'] = 'bar'
    
        const jsonResult = JSON.stringify(timelineStore)
    
        expect(() => {
            JSON.parse(jsonResult, JsonParser.cardsReviver)
        }).toThrow(JsonParserException);
    })
})
