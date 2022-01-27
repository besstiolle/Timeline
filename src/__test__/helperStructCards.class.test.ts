
import { HelperStructCards } from "$lib/helperStructCards.class";
import { Struct } from "$lib/struct.class";

jest.mock('$app/env', () => ({
    default: {
        browser: true,
      },
  }))


function testUpdateCardsWithTimeline(){

    let cards1 = new Array<Struct.Card>()
    cards1.push(new Struct.Card("key1", "title1"))
    cards1.push(new Struct.Card("key2", "title2"))
    cards1.push(new Struct.Card("key3", "title3"))
    let cards2 = [...cards1]


    let timeline2:Struct.Timeline = new Struct.Timeline("key2","new title2")
    let timeline4:Struct.Timeline = new Struct.Timeline("key4","new title4")

    HelperStructCards.updateCardsWithTimeline(cards1, timeline2)
    HelperStructCards.updateCardsWithTimeline(cards2, timeline4)
    
    test("HelperStructCards.updateCardsWithTimeline with an existing key", ()=> {
        expect(cards1.length).toEqual(3)
        expect(cards1[1].title).toEqual(timeline2.title)
    })
    
    test("HelperStructCards.updateCardsWithTimeline with an new key", ()=> {
        expect(cards2.length).toEqual(4)
        expect(cards2[3].key).toEqual(timeline4.key)
        expect(cards2[3].title).toEqual(timeline4.title)
        expect(cards2[3].lastUpdated).toBeDefined()
    })
    
}
testUpdateCardsWithTimeline()
