

import { JsonParser } from "$lib/jsonParser"
import { Struct } from "$lib/struct.class"
import { JsonParserException } from "$lib/timelineException.class"



function withoutCards(){
    let timelineStore = new Struct.TimelineStore()
   
    
    let jsonResult = JSON.stringify(timelineStore.cards)
    let jsonExpected = '[]'
    test("JsonParser.cardsReplacer with cards values", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    let object = JSON.parse(jsonResult, JsonParser.cardsReviver)
    test("JsonParser.cardsReviver with cards values", ()=> {
        expect(object.constructor.name).toEqual("Array")
        expect((<Array<Struct.Card>>object).length).toBe(0)
    })
}
withoutCards()


function withCards(){
    let timelineStore = new Struct.TimelineStore()
    let card1 = new Struct.Card("key1", "title1") 
    card1.lastUpdated = new Date("2020-12-31")
    let card2 = new Struct.Card("key2", "title2") 
    card2.lastUpdated = new Date("2022-01-01")
    let card3 = new Struct.Card("key3", "title3") 
    card3.lastUpdated = new Date("2021-02-01")
    timelineStore.cards.push(card1)
    timelineStore.cards.push(card2)
    timelineStore.cards.push(card3)
   
    
    let jsonResult = JSON.stringify(timelineStore.cards)
    let jsonExpected = JSON.stringify(require('./json/reviverCards_withCards.json'))

    test("JsonParser.cardsReplacer with cards values", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    let object = JSON.parse(jsonResult, JsonParser.cardsReviver)
    test("JsonParser.cardsReviver with cards values", ()=> {
        expect(object.constructor.name).toEqual("Array")
        expect((<Array<Struct.Card>>object).length).toBe(3)
        expect((<Array<Struct.Card>>object)[0].key).toBe("key1")
        expect((<Array<Struct.Card>>object)[0].title).toBe("title1")
        expect((<Array<Struct.Card>>object)[0].lastUpdated).toEqual(new Date("2020-12-31"))
    })
}
withCards()


function withUnknowKey(){
    let timelineStore = new Struct.TimelineStore()
    timelineStore['unknowKey'] = 'bar'

    let jsonResult = JSON.stringify(timelineStore)

    //Mock console.error() to avoid jest panic
    jest.spyOn(console, 'error').mockImplementation(() => {});

    test("JsonParser.cardsReviver with unknow values", ()=> {
        expect(() => {
            JSON.parse(jsonResult, JsonParser.cardsReviver)
        }).toThrow(JsonParserException);
    })

}
withUnknowKey()