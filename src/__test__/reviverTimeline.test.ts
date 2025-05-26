

import { describe, expect, it, vi } from 'vitest'
import { JsonParser } from "$lib/jsonParser"
import { Struct } from "$lib/struct.class"
import { JsonParserException } from "$lib/timelineException.class"
import reviverTimeline_withAllvalues from './json/reviverTimeline_withAllvalues.json'
import reviverTimeline_withMetaTimelines from './json/reviverTimeline_withMetaTimelines.json'
import reviverTimeline_withTask from './json/reviverTimeline_withTask.json'
import reviverTimeline_withMilestone from './json/reviverTimeline_withMilestone.json'
//import x from 

//Mock console.error() to avoid vi console pollution
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('test factoryCards', () => {
    const timeline = new Struct.Timeline("key", "title")
    timeline.tasks = new Array<Struct.Task>()
    timeline.tasks.push(new Struct.Task(1,"label 1", "2022-01-01", "2022-02-01", false, 100, true, "Swimline 1", 5))
    
    const jsonResult = JSON.stringify(timeline)
    const jsonExpected = JSON.stringify(reviverTimeline_withTask)
    it("JsonParser.timelineReplacer with tasks values", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    const object = JSON.parse(jsonResult, JsonParser.timelineReviver)
    it("JsonParser.timelineReviver with tasks values", ()=> {
        expect(object.tasks[0].constructor.name).toEqual("Task")
        expect(object).toEqual(timeline)  
    })
})

describe('test factoryCards', () => {
    const timeline = new Struct.Timeline("key", "title")
    timeline.milestones = new Array<Struct.Milestone>()
    timeline.milestones.push(new Struct.Milestone(1,"label 1", "2022-01-01",true))
    
    const jsonResult = JSON.stringify(timeline)
    const jsonExpected = JSON.stringify(reviverTimeline_withMilestone)
    it("JsonParser.timelineReplacer with milestones values", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    const object = JSON.parse(jsonResult, JsonParser.timelineReviver)
    it("JsonParser.timelineReviver with milestones values", ()=> {
        expect(object.milestones[0].constructor.name).toEqual("Milestone")
        expect(object).toEqual(timeline)          
    })
})

describe('test factoryCards', () => {
    const timeline = new Struct.Timeline("key", "title")
    timeline.start = "2022-01-01"
    timeline.end = "2022-12-31"
    timeline.isInitiate = true
    timeline.maxId = 99
    timeline.showAll = true
    timeline.viewbox = "viewbox"

    const jsonResult = JSON.stringify(timeline)
    const jsonExpected = JSON.stringify(reviverTimeline_withMetaTimelines)
    it("JsonParser.timelineReplacer with Metadatas", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    const object = JSON.parse(jsonResult, JsonParser.timelineReviver)
    it("JsonParser.timelineReviver with Metadatas", ()=> {
        expect(object).toEqual(timeline)          
    })
})

describe('test factoryCards', () => {
    const timeline = new Struct.Timeline("key", "title")
    timeline.tasks = new Array<Struct.Task>()
    timeline.tasks.push(new Struct.Task(1,"label 1", "2022-01-01", "2022-02-01", true, 100, true, "Swimline 1", 5))
    timeline.milestones = new Array<Struct.Milestone>()
    timeline.milestones.push(new Struct.Milestone(1,"label 1","2022-01-01",true))
    timeline.start = "2022-01-01"
    timeline.end = "2022-12-31"
    timeline.isInitiate = true
    timeline.maxId = 99
    timeline.showAll = true
    timeline.viewbox = "viewbox"

    const jsonResult = JSON.stringify(timeline)
    const jsonExpected = JSON.stringify(reviverTimeline_withAllvalues)
    it("JsonParser.timelineReplacer with all values", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    const object = JSON.parse(jsonResult, JsonParser.timelineReviver)
    it("JsonParser.timelineReviver with all values", ()=> {
        expect(object).toEqual(timeline)          
    })

})

describe('test factoryCards', () => {
    const timeline = new Struct.Timeline("key", "title")
    // @ts-expect-error forcing error for testing porpose
    timeline['unknowKey'] = 'bar'

    const jsonResult = JSON.stringify(timeline)

    it("JsonParser.timelineReviver with unknow values", ()=> {
        expect(() => {
            JSON.parse(jsonResult, JsonParser.timelineReviver)
        }).toThrow(JsonParserException);
    })

})