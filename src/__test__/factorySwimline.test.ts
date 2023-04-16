import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FactorySwimline } from "$lib/factorySwimline";
import { Struct } from "$lib/struct.class";

describe('FactorySwimline.create', () => {

    let timeline = new Struct.Timeline("key", "title")
    FactorySwimline.create(timeline, "swimline1")
    let index2 = FactorySwimline.create(timeline, "swimline2")
    FactorySwimline.create(timeline, "swimline3")

    it("FactorySwimline.create with nominal values", ()=> {
        expect(index2).toBe(1)
        expect(timeline.swimlines.length).toBe(3)
        expect(timeline.swimlines[index2].label).toBe("swimline2")
    })
})