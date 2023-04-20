import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FactoryMilestone } from "$lib/factoryMilestone";
import { Struct } from "$lib/struct.class";
import { NotFoundException } from "$lib/timelineException.class";

//Mock console.error() to avoid vi console pollution
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('FactoryMilestone.join', () => {
    let milestone: Struct.Milestone = new Struct.Milestone(1,"label","2020-01-01", true)
    let result:string = "milestone;label;true;2020-01-01"
    it("FactoryMilestone.join with nominal values", ()=> {
        expect(FactoryMilestone.join(milestone,";")).toBe(result)
    }) 
})

describe('FactoryMilestone.getById ', () => {
    let milestone1: Struct.Milestone = new Struct.Milestone(1,"label 1","2020-01-01", true)
    let milestone2: Struct.Milestone = new Struct.Milestone(2,"label 2","2020-01-01", true)
    let milestone3: Struct.Milestone = new Struct.Milestone(3,"label 3","2020-01-01", true)
    let milestone4: Struct.Milestone = new Struct.Milestone(4,"label 4","2020-01-01", true)
    let timeline = new Struct.Timeline("key", "title")
    timeline.milestones.push(milestone1)
    timeline.milestones.push(milestone2)
    timeline.milestones.push(milestone3)
    timeline.milestones.push(milestone4)

    it("FactoryMilestone.getById with nominal values", ()=> {
        expect(FactoryMilestone.getById(timeline, 2)).toBe(milestone2)
    })

    it("FactoryMilestone.getById with unknow values", ()=> {
        expect(() => {
            FactoryMilestone.getById(timeline, 10)
        }).toThrow(NotFoundException);
    })
})

describe('FactoryMilestone.clone ', () => {
    let milestone1: Struct.Milestone = new Struct.Milestone(1,"label 1","2020-01-01", true)
    let milestone2 = FactoryMilestone.clone(milestone1)

    it("FactoryTask.clone and check memory pointer", ()=> {
        expect(milestone1).not.toBe(milestone2)
        expect(milestone1).toStrictEqual(milestone2)
    })
})
