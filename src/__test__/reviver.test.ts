

import { Helpers } from "$lib/helpers.class"
import { Struct } from "$lib/struct.class"



function withTask(){
    let data = new Struct.Timeline()
    data.tasks = new Array<Struct.Task>()
    data.tasks.push(new Struct.Task(1,"label 1", new Date("2022-01-01"), new Date("2022-02-01"), 100, true, "Swimline 1", 5))
    
    let jsonResult = JSON.stringify(data)
    let jsonExpected = '{"tasks":[{"id":1,"label":"label 1","dateStart":"2022-01-01T00:00:00.000Z","dateEnd":"2022-02-01T00:00:00.000Z","progress":100,"isShow":true,"swimline":"Swimline 1","swimlineId":5}],"milestones":[],"swimlines":[],"isInitiate":false,"start":null,"end":null,"maxId":0,"viewbox":"0 0 0 0","showAll":false}'
    test("TimelineReviver.replacer with tasks values", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    let object = JSON.parse(jsonResult, Helpers.dataReviver)
    test("TimelineReviver.reviver with tasks values", ()=> {
        expect(object.tasks[0].constructor.name).toEqual("Task")
        expect(object).toEqual(data)  
    })
}
withTask()


function withMilestone(){
    let data = new Struct.Timeline()
    data.milestones = new Array<Struct.Milestone>()
    data.milestones.push(new Struct.Milestone(1,"label 1", new Date("2022-01-01"),true))
    
    let jsonResult = JSON.stringify(data)
    let jsonExpected = '{"tasks":[],"milestones":[{"id":1,"label":"label 1","date":"2022-01-01T00:00:00.000Z","isShow":true}],"swimlines":[],"isInitiate":false,"start":null,"end":null,"maxId":0,"viewbox":"0 0 0 0","showAll":false}'
    test("TimelineReviver.replacer with milestones values", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    let object = JSON.parse(jsonResult, Helpers.dataReviver)
    test("TimelineReviver.reviver with milestones values", ()=> {
        expect(object.milestones[0].constructor.name).toEqual("Milestone")
        expect(object).toEqual(data)          
    })
}
withMilestone()

function withMetaTimelines(){
    let data = new Struct.Timeline()
    data.start = new Date("2022-01-01")
    data.end = new Date("2022-12-31")
    data.isInitiate = true
    data.maxId = 99
    data.showAll = true
    data.viewbox = "viewbox"

    let jsonResult = JSON.stringify(data)
    let jsonExpected = '{"tasks":[],"milestones":[],"swimlines":[],"isInitiate":true,"start":"2022-01-01T00:00:00.000Z","end":"2022-12-31T00:00:00.000Z","maxId":99,"viewbox":"viewbox","showAll":true}'
    test("TimelineReviver.replacer with Metadatas", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    let object = JSON.parse(jsonResult, Helpers.dataReviver)
    test("TimelineReviver.reviver with Metadatas", ()=> {
        expect(object).toEqual(data)          
    })
}
withMetaTimelines()

function withAllvalues(){
    let data = new Struct.Timeline()
    data.tasks = new Array<Struct.Task>()
    data.tasks.push(new Struct.Task(1,"label 1", new Date("2022-01-01"), new Date("2022-02-01"), 100, true, "Swimline 1", 5))
    data.milestones = new Array<Struct.Milestone>()
    data.milestones.push(new Struct.Milestone(1,"label 1", new Date("2022-01-01"),true))
    data.start = new Date("2022-01-01")
    data.end = new Date("2022-12-31")
    data.isInitiate = true
    data.maxId = 99
    data.showAll = true
    data.viewbox = "viewbox"

    let jsonResult = JSON.stringify(data)
    let jsonExpected = '{"tasks":[{"id":1,"label":"label 1","dateStart":"2022-01-01T00:00:00.000Z","dateEnd":"2022-02-01T00:00:00.000Z","progress":100,"isShow":true,"swimline":"Swimline 1","swimlineId":5}],"milestones":[{"id":1,"label":"label 1","date":"2022-01-01T00:00:00.000Z","isShow":true}],"swimlines":[],"isInitiate":true,"start":"2022-01-01T00:00:00.000Z","end":"2022-12-31T00:00:00.000Z","maxId":99,"viewbox":"viewbox","showAll":true}'
    test("TimelineReviver.replacer with all values", ()=> {
        expect(jsonResult).toBe(jsonExpected)  
    })

    let object = JSON.parse(jsonResult, Helpers.dataReviver)
    test("TimelineReviver.reviver with all values", ()=> {
        expect(object).toEqual(data)          
    })

}
withAllvalues()