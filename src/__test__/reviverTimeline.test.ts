

import { JsonParser } from "$lib/jsonParser"
import { Struct } from "$lib/struct.class"



function withTask(){
    let timeline = new Struct.Timeline("key", "title")
    timeline.tasks = new Array<Struct.Task>()
    timeline.tasks.push(new Struct.Task(1,"label 1", new Date("2022-01-01"), new Date("2022-02-01"), 100, true, "Swimline 1", 5))
    
    let jsonResult = JSON.stringify(timeline)
    let jsonExpected = '{"key":"key","title":"title","tasks":[{"id":1,"label":"label 1","dateStart":"2022-01-01T00:00:00.000Z","dateEnd":"2022-02-01T00:00:00.000Z","progress":100,"isShow":true,"swimline":"Swimline 1","swimlineId":5}],"milestones":[],"swimlines":[],"isInitiate":false,"start":null,"end":null,"maxId":0,"viewbox":"0 0 0 0","showAll":false}'
    test("TimelineReviver.replacer with tasks values", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    let object = JSON.parse(jsonResult, JsonParser.timelineReviver)
    test("TimelineReviver.reviver with tasks values", ()=> {
        expect(object.tasks[0].constructor.name).toEqual("Task")
        expect(object).toEqual(timeline)  
    })
}
withTask()


function withMilestone(){
    let timeline = new Struct.Timeline("key", "title")
    timeline.milestones = new Array<Struct.Milestone>()
    timeline.milestones.push(new Struct.Milestone(1,"label 1", new Date("2022-01-01"),true))
    
    let jsonResult = JSON.stringify(timeline)
    let jsonExpected = '{"key":"key","title":"title","tasks":[],"milestones":[{"id":1,"label":"label 1","date":"2022-01-01T00:00:00.000Z","isShow":true}],"swimlines":[],"isInitiate":false,"start":null,"end":null,"maxId":0,"viewbox":"0 0 0 0","showAll":false}'
    test("TimelineReviver.replacer with milestones values", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    let object = JSON.parse(jsonResult, JsonParser.timelineReviver)
    test("TimelineReviver.reviver with milestones values", ()=> {
        expect(object.milestones[0].constructor.name).toEqual("Milestone")
        expect(object).toEqual(timeline)          
    })
}
withMilestone()

function withMetaTimelines(){
    let timeline = new Struct.Timeline("key", "title")
    timeline.start = new Date("2022-01-01")
    timeline.end = new Date("2022-12-31")
    timeline.isInitiate = true
    timeline.maxId = 99
    timeline.showAll = true
    timeline.viewbox = "viewbox"

    let jsonResult = JSON.stringify(timeline)
    let jsonExpected = '{"key":"key","title":"title","tasks":[],"milestones":[],"swimlines":[],"isInitiate":true,"start":"2022-01-01T00:00:00.000Z","end":"2022-12-31T00:00:00.000Z","maxId":99,"viewbox":"viewbox","showAll":true}'
    test("TimelineReviver.replacer with Metadatas", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    let object = JSON.parse(jsonResult, JsonParser.timelineReviver)
    test("TimelineReviver.reviver with Metadatas", ()=> {
        expect(object).toEqual(timeline)          
    })
}
withMetaTimelines()

function withAllvalues(){
    let timeline = new Struct.Timeline("key", "title")
    timeline.tasks = new Array<Struct.Task>()
    timeline.tasks.push(new Struct.Task(1,"label 1", new Date("2022-01-01"), new Date("2022-02-01"), 100, true, "Swimline 1", 5))
    timeline.milestones = new Array<Struct.Milestone>()
    timeline.milestones.push(new Struct.Milestone(1,"label 1", new Date("2022-01-01"),true))
    timeline.start = new Date("2022-01-01")
    timeline.end = new Date("2022-12-31")
    timeline.isInitiate = true
    timeline.maxId = 99
    timeline.showAll = true
    timeline.viewbox = "viewbox"

    let jsonResult = JSON.stringify(timeline)
    let jsonExpected = '{"key":"key","title":"title","tasks":[{"id":1,"label":"label 1","dateStart":"2022-01-01T00:00:00.000Z","dateEnd":"2022-02-01T00:00:00.000Z","progress":100,"isShow":true,"swimline":"Swimline 1","swimlineId":5}],"milestones":[{"id":1,"label":"label 1","date":"2022-01-01T00:00:00.000Z","isShow":true}],"swimlines":[],"isInitiate":true,"start":"2022-01-01T00:00:00.000Z","end":"2022-12-31T00:00:00.000Z","maxId":99,"viewbox":"viewbox","showAll":true}'
    test("TimelineReviver.replacer with all values", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    let object = JSON.parse(jsonResult, JsonParser.timelineReviver)
    test("TimelineReviver.reviver with all values", ()=> {
        expect(object).toEqual(timeline)          
    })

}
withAllvalues()