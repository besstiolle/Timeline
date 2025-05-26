import { describe, expect, it, vi } from 'vitest'

import { FactoryCards } from "$lib/factoryCards"
import { Struct } from "$lib/struct.class";


describe('test factoryCards', () => {

    vi.mock('$app/environment', () => ({
        default: {
            browser: true,
        },
    }))

    it('FactoryCards.updateCardsWithTimeline with an existing key', () => {

        const cards = new Array<Struct.Card>()
        cards.push(new Struct.Card("key1", "title1"))
        cards.push(new Struct.Card("key2", "title2"))
        cards.push(new Struct.Card("key3", "title3"))


        const timeline:Struct.Timeline = new Struct.Timeline("key2","new title2")

        FactoryCards.updateCardsWithTimeline(cards, timeline)
        
        expect(cards.length).toEqual(3)
        expect(cards[1].title).toEqual(timeline.title)

    })

    it('FactoryCards.updateCardsWithTimeline with an new key', () => {

        const cards = new Array<Struct.Card>()
        cards.push(new Struct.Card("key1", "title1"))
        cards.push(new Struct.Card("key2", "title2"))
        cards.push(new Struct.Card("key3", "title3"))


        const timeline:Struct.Timeline = new Struct.Timeline("key4","new title4")

        FactoryCards.updateCardsWithTimeline(cards, timeline)

        expect(cards.length).toEqual(4)
        expect(cards[3].key).toEqual(timeline.key)
        expect(cards[3].title).toEqual(timeline.title)
        expect(cards[3].lastUpdated).toBeDefined()
        
    })

    it('FactoryCards.getIndexByKey with various parameters', () => {

        const cards = new Array<Struct.Card>()
        cards.push(new Struct.Card("key1", "title1"))
        cards.push(new Struct.Card("key2", "title2"))
        cards.push(new Struct.Card("key3", "title3"))

        expect(FactoryCards.getIndexByKey(cards, "")).toBeNull()
        expect(FactoryCards.getIndexByKey(cards, "unknow")).toBeNull()
        expect(FactoryCards.getIndexByKey(cards, "key2")).toEqual(1)
    })

    it('FactoryCards.getFirstIndexByTitle with various parameters', () => {

        
        const cards1 = new Array<Struct.Card>()
        cards1.push(new Struct.Card("key1", "title1"))
        cards1.push(new Struct.Card("key2", "title2"))
        cards1.push(new Struct.Card("key3", "title3"))
        cards1.push(new Struct.Card("key4", "title2"))

        expect(FactoryCards.getFirstIndexByTitle(cards1, "")).toBeNull()
        expect(FactoryCards.getFirstIndexByTitle(cards1, "unknow")).toBeNull()
        expect(FactoryCards.getFirstIndexByTitle(cards1, "title2")).toEqual(1)
    })

})