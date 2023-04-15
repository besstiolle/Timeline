
import { FactoryCards } from "$lib/factoryCards"
import { Struct } from "$lib/struct.class";

jest.mock('$app/environment', () => ({
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

    FactoryCards.updateCardsWithTimeline(cards1, timeline2)
    FactoryCards.updateCardsWithTimeline(cards2, timeline4)
    
    test("FactoryCards.updateCardsWithTimeline with an existing key", ()=> {
        expect(cards1.length).toEqual(3)
        expect(cards1[1].title).toEqual(timeline2.title)
    })
    
    test("FactoryCards.updateCardsWithTimeline with an new key", ()=> {
        expect(cards2.length).toEqual(4)
        expect(cards2[3].key).toEqual(timeline4.key)
        expect(cards2[3].title).toEqual(timeline4.title)
        expect(cards2[3].lastUpdated).toBeDefined()
    })
    
}
testUpdateCardsWithTimeline()

function testGetIndexByKey(){
    let cards1 = new Array<Struct.Card>()
    cards1.push(new Struct.Card("key1", "title1"))
    cards1.push(new Struct.Card("key2", "title2"))
    cards1.push(new Struct.Card("key3", "title3"))

    expect(FactoryCards.getIndexByKey(cards1, "")).toBeNull()
    expect(FactoryCards.getIndexByKey(cards1, "unknow")).toBeNull()
    expect(FactoryCards.getIndexByKey(cards1, "key2")).toEqual(1)
}
testGetIndexByKey()

function testGetFirstIndexByTitle(){
    let cards1 = new Array<Struct.Card>()
    cards1.push(new Struct.Card("key1", "title1"))
    cards1.push(new Struct.Card("key2", "title2"))
    cards1.push(new Struct.Card("key3", "title3"))
    cards1.push(new Struct.Card("key4", "title2"))

    expect(FactoryCards.getFirstIndexByTitle(cards1, "")).toBeNull()
    expect(FactoryCards.getFirstIndexByTitle(cards1, "unknow")).toBeNull()
    expect(FactoryCards.getFirstIndexByTitle(cards1, "title2")).toEqual(1)

}
testGetFirstIndexByTitle()