

import { JsonParser } from "$lib/jsonParser"
import { Struct } from "$lib/struct.class"



function withoutCards(){
    let timelineStore = new Struct.TimelineStore()
   
    
    let jsonResult = JSON.stringify(timelineStore.cards)
    let jsonExpected = '[]'
    test("TimelineReviver.replacer with tasks values", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    let object = JSON.parse(jsonResult, JsonParser.cardsReviver)
    test("TimelineReviver.reviver with tasks values", ()=> {
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
    let jsonExpected = '[{"key":"key1","title":"title1","lastUpdated":"2020-12-31T00:00:00.000Z"},{"key":"key2","title":"title2","lastUpdated":"2022-01-01T00:00:00.000Z"},{"key":"key3","title":"title3","lastUpdated":"2021-02-01T00:00:00.000Z"}]'
    test("TimelineReviver.replacer with tasks values", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    let object = JSON.parse(jsonResult, JsonParser.cardsReviver)
    test("TimelineReviver.reviver with tasks values", ()=> {
        expect(object.constructor.name).toEqual("Array")
        expect((<Array<Struct.Card>>object).length).toBe(3)
        expect((<Array<Struct.Card>>object)[0].key).toBe("key1")
        expect((<Array<Struct.Card>>object)[0].title).toBe("title1")
        expect((<Array<Struct.Card>>object)[0].lastUpdated).toEqual(new Date("2020-12-31"))
    })
}
withCards()
